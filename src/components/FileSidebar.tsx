import React, { useRef, useState } from 'react'
import { useApp } from '@/context/AppContext'
import {
  IconUpload,
  IconFile,
  IconFileExcel,
  IconFileJson,
  IconMore,
  IconFolder,
  IconArrowRight,
  IconTrash,
} from '@/icons'

function getFileIcon(name: string) {
  if (name.endsWith('.xlsx')) return IconFileExcel
  if (name.endsWith('.json')) return IconFileJson
  return IconFile
}

export default function FileSidebar({ embedded = false }: { embedded?: boolean }) {
  const { datasets, activeDataset, setActiveDataset, removeDataset, importDataset, isImporting, importError } = useApp()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      void importDataset(files[0])
    }
  }

  return (
    <div className={`flex ${embedded ? 'flex-col rounded-lg border border-border bg-bg-card' : 'h-full flex-col'}`}>
      {/* FILES header */}
      <div className="px-4 pt-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">FILES</h3>
      </div>

      {/* Upload zone */}
      <div className="px-4 pt-3">
        <p className="mb-2 text-[13px] font-medium text-fg">Upload New Dataset</p>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`drag-zone flex flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-all ${
            isDragging ? 'drag-over border-accent bg-accent-dim' : 'border-border bg-bg-card'
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-hover">
            <IconUpload className="text-fg-muted" />
          </div>
          <p className="text-[13px] text-fg-muted">Drag and drop your file here</p>
          <p className="text-[12px] text-fg-dim">or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md bg-accent px-4 py-1.5 text-[13px] font-medium text-bg transition-colors hover:bg-accent-hover"
          >
            {isImporting ? 'Importing…' : 'Browse Files'}
          </button>
          <p className="mt-1 text-[11px] text-fg-dim">Supports CSV, Parquet, JSON, XLSX</p>
          <p className="text-[11px] text-fg-dim">Max file size 2GB</p>
        </div>
        {importError && <p className="mt-2 text-[11px] text-danger">{importError}</p>}
      </div>

      {/* Recent files */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">RECENT FILES</h4>
          <button className="text-[11px] text-accent hover:underline">View all</button>
        </div>

        <div className="space-y-1">
          {datasets.map((ds) => {
            const FileIcon = getFileIcon(ds.name)
            const isActive = activeDataset?.id === ds.id
            return (
              <button
                key={ds.id}
                onClick={() => setActiveDataset(ds)}
                className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors ${
                  isActive
                    ? 'bg-accent-dim'
                    : 'hover:bg-bg-hover'
                }`}
              >
                <FileIcon className={`shrink-0 ${isActive ? 'text-accent' : 'text-fg-dim'}`} />
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-[13px] ${isActive ? 'text-accent' : 'text-fg'}`}>
                    {ds.name}
                  </p>
                  <p className="truncate text-[11px] text-fg-dim">{ds.rows.toLocaleString()} rows · {ds.uploadedAt}</p>
                </div>
                <span className="shrink-0 text-fg-dim"><IconMore /></span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Go to datasets */}
      <div className="border-t border-border p-4">
        <button className="flex w-full items-center justify-between rounded-md border border-border bg-bg-card px-3 py-2.5 text-[13px] text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg">
          <span className="flex items-center gap-2">
            <IconFolder />
            Go to Datasets
          </span>
          <IconArrowRight />
        </button>
        {activeDataset && (
          <button
            onClick={() => removeDataset(activeDataset.id)}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-bg-card px-3 py-2.5 text-[13px] text-fg-muted transition-colors hover:border-danger/40 hover:text-danger"
          >
            <IconTrash />
            Remove Active Dataset
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".csv,.tsv,.json,.xlsx,.xls,.parquet,.txt"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) return
          void importDataset(file)
          event.target.value = ''
        }}
      />
    </div>
  )
}
