import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import {
  IconChevronLeft,
  IconChevronRight,
} from '@/icons'

const tabs = ['DATA PREVIEW', 'SUMMARY', 'FEATURES', 'DATA QUALITY', 'CORRELATIONS', 'TARGET ANALYSIS']

export default function DataTable() {
  const { activeDataset, activeTab, setActiveTab } = useApp()
  const [currentPage, setCurrentPage] = useState(1)

  const data = activeDataset?.data || []
  const headers = activeDataset?.headers || []
  const totalRows = activeDataset?.rows || 0

  const rowsPerPage = 5
  const previewPages = Math.max(1, Math.ceil(data.length / rowsPerPage))
  const currentRows = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const missingCells = data.reduce((count, row) => {
    return count + Object.values(row).filter((value) => value === null).length
  }, 0)
  const totalCells = Math.max(1, data.length * Math.max(1, headers.length))
  const completeness = `${Math.round(((totalCells - missingCells) / totalCells) * 100)}%`
  const numericColumns = Object.entries(activeDataset?.types || {}).filter(([, type]) => type === 'numeric').length
  const categoricalColumns = Object.entries(activeDataset?.types || {}).filter(([, type]) => type === 'categorical').length

  const renderTabContent = () => {
    if (activeTab === 'SUMMARY') {
      return (
        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Rows', value: totalRows.toLocaleString() },
            { label: 'Columns', value: headers.length.toString() },
            { label: 'Completeness', value: completeness },
            { label: 'Numeric Features', value: numericColumns.toString() },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-bg-elevated p-4">
              <p className="text-[11px] uppercase tracking-wider text-fg-muted">{item.label}</p>
              <p className="mt-2 text-[22px] font-semibold text-fg">{item.value}</p>
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === 'FEATURES') {
      return (
        <div className="overflow-x-auto p-4">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Type</th>
                <th>Completeness</th>
              </tr>
            </thead>
            <tbody>
              {headers.map((header) => {
                const columnValues = data.map((row) => row[header])
                const completenessRate = Math.round(
                  (columnValues.filter((value) => value !== null).length / Math.max(1, columnValues.length)) * 100,
                )

                return (
                  <tr key={header}>
                    <td>{header}</td>
                    <td>{activeDataset?.types[header] || 'unknown'}</td>
                    <td>{completenessRate}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }

    if (activeTab === 'DATA QUALITY') {
      return (
        <div className="space-y-3 p-4">
          <div className="rounded-lg border border-border bg-bg-elevated p-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-fg">Overall completeness</p>
              <span className="text-[13px] font-medium text-accent">{completeness}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-hover">
              <div className="h-full rounded-full bg-accent" style={{ width: completeness }} />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-bg-elevated p-4">
              <p className="text-[11px] uppercase tracking-wider text-fg-muted">Missing cells</p>
              <p className="mt-2 text-[22px] font-semibold text-fg">{missingCells.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border bg-bg-elevated p-4">
              <p className="text-[11px] uppercase tracking-wider text-fg-muted">Categorical features</p>
              <p className="mt-2 text-[22px] font-semibold text-fg">{categoricalColumns}</p>
            </div>
          </div>
        </div>
      )
    }

    if (activeTab === 'CORRELATIONS') {
      return (
        <div className="grid gap-3 p-4 md:grid-cols-2">
          {[
            ['monthly_charges ↔ total_charges', '0.78'],
            ['tenure_months ↔ churn', '-0.56'],
            ['age ↔ monthly_charges', '0.31'],
            ['spend ↔ revenue', '0.82'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border bg-bg-elevated p-4">
              <p className="text-[12px] text-fg-muted">{label}</p>
              <p className="mt-2 text-[22px] font-semibold text-accent">{value}</p>
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === 'TARGET ANALYSIS') {
      return (
        <div className="grid gap-3 p-4 md:grid-cols-3">
          {[
            ['Positive class', '23%'],
            ['Balanced score', '0.81'],
            ['Drift risk', 'Low'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border bg-bg-elevated p-4">
              <p className="text-[11px] uppercase tracking-wider text-fg-muted">{label}</p>
              <p className="mt-2 text-[22px] font-semibold text-fg">{value}</p>
            </div>
          ))}
        </div>
      )
    }

    return (
      <>
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h}>
                    <div className="flex items-center gap-1">
                      {h}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, i) => (
                <tr key={i}>
                  {headers.map((h) => (
                    <td key={h}>{row[h] ?? '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[12px] text-fg-dim">
            Previewing {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, Math.max(data.length, rowsPerPage))} of {totalRows.toLocaleString()} rows
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-7 w-7 items-center justify-center rounded-md text-fg-dim transition-colors hover:bg-bg-hover hover:text-fg disabled:opacity-30"
            >
              <IconChevronLeft />
            </button>

            {Array.from({ length: Math.min(previewPages, 3) }, (_, index) => index + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-[12px] transition-colors ${
                  currentPage === p
                    ? 'bg-accent text-bg'
                    : 'text-fg-dim hover:bg-bg-hover hover:text-fg'
                }`}
              >
                {p}
              </button>
            ))}

            {previewPages > 3 && <span className="px-1 text-[12px] text-fg-dim">…</span>}

            <button
              onClick={() => setCurrentPage((p) => Math.min(previewPages, p + 1))}
              disabled={currentPage === previewPages}
              className="flex h-7 w-7 items-center justify-center rounded-md text-fg-dim transition-colors hover:bg-bg-hover hover:text-fg disabled:opacity-30"
            >
              <IconChevronRight />
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-bg-card">
      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setCurrentPage(1)
              setActiveTab(tab)
            }}
            className={`whitespace-nowrap px-3 py-3 text-[11px] font-medium uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? 'tab-active text-accent'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  )
}
