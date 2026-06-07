import { useState } from 'react'
import { useApp } from '@/context/AppContext'

interface SyntheticConfig {
  rows: number
  columns: number
  noise: number
  correlation: number
  missingRate: number
}

export default function SyntheticDataPanel() {
  const { addDataset } = useApp()
  const [config, setConfig] = useState<SyntheticConfig>({
    rows: 10000,
    columns: 15,
    noise: 0.1,
    correlation: 0.3,
    missingRate: 0.05,
  })
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleGenerate = () => {
    setGenerating(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + Math.random() * 20
      })
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setGenerating(false)
      setProgress(100)

      const headers = Array.from({ length: config.columns }, (_, i) => `feature_${i + 1}`)
      const data = Array.from({ length: 5 }, (_, i) => {
        const row: Record<string, number> = {}
        headers.forEach((h) => {
          row[h] = Math.round((Math.random() * 100 + i * 10) * 100) / 100
        })
        return row
      })

      addDataset({
        id: `syn-${Date.now()}`,
        name: `synthetic_data_${config.rows}.csv`,
        rows: config.rows,
        columns: config.columns,
        size: `${(config.rows * config.columns * 8 / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: 'numeric', minute: '2-digit',
        }),
        headers,
        data,
        types: Object.fromEntries(headers.map((h) => [h, 'numeric'])),
      })

      setProgress(0)
    }, 2500)
  }

  return (
    <div className="rounded-lg border border-border bg-bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-[13px] font-semibold text-fg">Synthetic Data Generator</h3>
        <p className="mt-0.5 text-[12px] text-fg-muted">Generate artificial datasets for testing and training</p>
      </div>

      <div className="grid gap-6 p-4 lg:grid-cols-2">
        {/* Config */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-fg-muted">Rows</label>
            <input
              type="number"
              value={config.rows}
              onChange={(e) => setConfig({ ...config, rows: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-[13px] text-fg outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-fg-muted">Columns</label>
            <input
              type="number"
              value={config.columns}
              onChange={(e) => setConfig({ ...config, columns: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-[13px] text-fg outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-fg-muted">Noise Level: {config.noise}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.noise}
              onChange={(e) => setConfig({ ...config, noise: parseFloat(e.target.value) })}
              className="w-full accent-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-fg-muted">Correlation: {config.correlation}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.correlation}
              onChange={(e) => setConfig({ ...config, correlation: parseFloat(e.target.value) })}
              className="w-full accent-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-fg-muted">Missing Rate: {config.missingRate}</label>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={config.missingRate}
              onChange={(e) => setConfig({ ...config, missingRate: parseFloat(e.target.value) })}
              className="w-full accent-accent"
            />
          </div>
        </div>

        {/* Preview & action */}
        <div className="flex flex-col justify-between">
          <div className="rounded-lg border border-border bg-bg-elevated p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Preview</p>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[12px] text-fg-dim">Total cells</span>
                <span className="text-[12px] font-mono text-fg">{(config.rows * config.columns).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-fg-dim">Estimated size</span>
                <span className="text-[12px] font-mono text-fg">{(config.rows * config.columns * 8 / (1024 * 1024)).toFixed(1)} MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-fg-dim">Missing values</span>
                <span className="text-[12px] font-mono text-fg">{Math.round(config.rows * config.columns * config.missingRate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-fg-dim">Data types</span>
                <span className="text-[12px] font-mono text-fg">Numeric</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {generating && (
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[12px] text-fg-muted">Generating...</span>
                  <span className="text-[12px] font-mono text-accent">{Math.min(100, Math.round(progress))}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-bg-hover">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-300"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-[13px] font-medium text-bg transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v18M3 12h18"/>
              </svg>
              {generating ? 'Generating...' : 'Generate Dataset'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
