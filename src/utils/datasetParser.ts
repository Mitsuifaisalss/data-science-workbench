import type { Dataset } from '@/context/AppContext'
import { parquetMetadataAsync, parquetReadObjects, parquetSchema } from 'hyparquet'

type JsonRow = Record<string, unknown>

const PREVIEW_ROW_LIMIT = 50

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function formatUploadedAt(date: Date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeCell(value: unknown): string | number | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'bigint') {
    const asNumber = Number(value)
    return Number.isSafeInteger(asNumber) ? asNumber : value.toString()
  }
  if (typeof value === 'boolean') return value ? 1 : 0
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (Array.isArray(value)) return JSON.stringify(value)
  if (isPlainObject(value)) return JSON.stringify(value)
  return String(value)
}

function inferColumnType(values: Array<string | number | null>) {
  const usableValues = values.filter((value) => value !== null)

  if (usableValues.length === 0) return 'unknown'

  const binaryLike = usableValues.every((value) => value === 0 || value === 1 || value === '0' || value === '1')
  if (binaryLike) return 'binary'

  const numericLike = usableValues.every((value) => typeof value === 'number' || (!Number.isNaN(Number(value)) && String(value).trim() !== ''))
  if (numericLike) return 'numeric'

  const dateLike = usableValues.every((value) => {
    if (typeof value !== 'string') return false
    const timestamp = Date.parse(value)
    return !Number.isNaN(timestamp) && /[-/]/.test(value)
  })
  if (dateLike) return 'date'

  const uniqueCount = new Set(usableValues.map((value) => String(value))).size
  if (uniqueCount <= Math.min(12, Math.ceil(usableValues.length * 0.4))) return 'categorical'

  return 'string'
}

function normalizeRows(rows: JsonRow[], explicitHeaders?: string[]) {
  const headers = explicitHeaders && explicitHeaders.length > 0
    ? explicitHeaders
    : Array.from(
        rows.reduce((accumulator, row) => {
          Object.keys(row).forEach((key) => accumulator.add(key))
          return accumulator
        }, new Set<string>()),
      )

  const normalized = rows.map((row) =>
    headers.reduce<Record<string, string | number | null>>((accumulator, header) => {
      accumulator[header] = normalizeCell(row[header])
      return accumulator
    }, {}),
  )

  const types = headers.reduce<Record<string, string>>((accumulator, header) => {
    accumulator[header] = inferColumnType(normalized.map((row) => row[header] ?? null))
    return accumulator
  }, {})

  return { headers, normalized, types }
}

function createDataset(file: File, rows: JsonRow[], headers?: string[], totalRows?: number): Dataset {
  const safeRows = rows.length > 0 ? rows : headers?.length ? [Object.fromEntries(headers.map((header) => [header, null]))] : []
  const { headers: normalizedHeaders, normalized, types } = normalizeRows(safeRows, headers)

  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
    name: file.name,
    rows: totalRows ?? rows.length,
    columns: normalizedHeaders.length,
    size: formatFileSize(file.size),
    uploadedAt: formatUploadedAt(new Date()),
    headers: normalizedHeaders,
    data: normalized.slice(0, PREVIEW_ROW_LIMIT),
    types,
  }
}

async function parseCsv(file: File) {
  const Papa = (await import('papaparse')).default

  return new Promise<JsonRow[]>((resolve, reject) => {
    Papa.parse<JsonRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data.filter((row) =>
          Object.values(row).some((value) => value !== null && value !== undefined && value !== ''),
        )
        resolve(data)
      },
      error: (error) => reject(error),
    })
  })
}

async function parseJson(file: File) {
  const text = await file.text()
  const parsed = JSON.parse(text) as unknown

  if (Array.isArray(parsed)) {
    if (parsed.every(isPlainObject)) return parsed as JsonRow[]
    return parsed.map((value, index) => ({ index: index + 1, value })) as JsonRow[]
  }

  if (isPlainObject(parsed)) {
    const arrayValue = Object.values(parsed).find((value) => Array.isArray(value))
    if (Array.isArray(arrayValue) && arrayValue.every(isPlainObject)) return arrayValue as JsonRow[]
    return [parsed]
  }

  return [{ value: parsed }]
}

async function parseSpreadsheet(file: File) {
  const XLSX = await import('xlsx')
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]

  return XLSX.utils.sheet_to_json<JsonRow>(firstSheet, {
    defval: null,
    raw: false,
  })
}

async function parseParquet(file: File) {
  const parquetFile = {
    byteLength: file.size,
    slice: (start: number, end?: number) => file.slice(start, end).arrayBuffer(),
  }

  const metadata = await parquetMetadataAsync(parquetFile)
  const schema = parquetSchema(metadata)
  const headers = schema.children.map((entry) => entry.element.name)
  const totalRows = Number(metadata.num_rows)
  const rows = await parquetReadObjects({
    file: parquetFile,
    rowEnd: Math.min(totalRows, PREVIEW_ROW_LIMIT),
  })

  return {
    rows: rows as JsonRow[],
    headers,
    totalRows,
  }
}

function parseTextTable(file: File, text: string) {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({ line_number: index + 1, text: line }))

  return createDataset(file, rows)
}

export async function parseDatasetFile(file: File): Promise<Dataset> {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (extension === 'csv' || extension === 'tsv') {
    const rows = await parseCsv(file)
    return createDataset(file, rows)
  }

  if (extension === 'json') {
    const rows = await parseJson(file)
    return createDataset(file, rows)
  }

  if (extension === 'xlsx' || extension === 'xls') {
    const rows = await parseSpreadsheet(file)
    return createDataset(file, rows)
  }

  if (extension === 'parquet') {
    const parsed = await parseParquet(file)
    return createDataset(file, parsed.rows, parsed.headers, parsed.totalRows)
  }

  if (extension === 'txt') {
    return parseTextTable(file, await file.text())
  }

  throw new Error('Unsupported file type. Please upload CSV, JSON, XLSX, XLS, TXT, or Parquet files.')
}