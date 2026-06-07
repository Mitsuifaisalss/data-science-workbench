import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import {
  IconSparkles,
  IconWand,
  IconBrain,
  IconTrash,
  IconActivity,
} from '@/icons'

interface CleaningTool {
  id: string
  name: string
  description: string
  icon: React.FC<{ className?: string }>
  category: string
}

const cleaningTools: CleaningTool[] = [
  { id: 'missing', name: 'Handle Missing Values', description: 'Fill or drop nulls', icon: IconWand, category: 'Data Cleaning' },
  { id: 'duplicates', name: 'Remove Duplicates', description: 'Find and drop duplicate rows', icon: IconTrash, category: 'Data Cleaning' },
  { id: 'outliers', name: 'Outlier Detection', description: 'Z-score & IQR methods', icon: IconActivity, category: 'Data Cleaning' },
  { id: 'normalize', name: 'Normalize Data', description: 'Min-max & standard scaling', icon: IconSparkles, category: 'Transform' },
  { id: 'encode', name: 'Encode Categories', description: 'One-hot & label encoding', icon: IconBrain, category: 'Transform' },
  { id: 'feature', name: 'Feature Engineering', description: 'Create new features', icon: IconSparkles, category: 'Transform' },
]

export default function DataCleaningPanel() {
  const { activeDataset } = useApp()
  const [activeTool, setActiveTool] = useState('missing')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState('')

  const handleClean = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      const tool = cleaningTools.find((t) => t.id === activeTool)
      setResult(`${tool?.name} completed successfully! Processed ${activeDataset?.rows.toLocaleString()} rows.`)
    }, 1500)
  }

  return (
    <div className="rounded-lg border border-border bg-bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-[13px] font-semibold text-fg">Data Cleaning &amp; Preprocessing</h3>
        <p className="mt-0.5 text-[12px] text-fg-muted">Clean, transform, and prepare your data for analysis</p>
      </div>

      <div className="flex flex-col gap-4 p-4 lg:flex-row">
        {/* Tools list */}
        <div className="flex flex-1 flex-wrap gap-2">
          {cleaningTools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id)
                  setResult('')
                }}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                  activeTool === tool.id
                    ? 'border-accent bg-accent-dim'
                    : 'border-border bg-bg-elevated hover:border-border-subtle'
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                  activeTool === tool.id ? 'bg-accent text-bg' : 'bg-bg-hover text-fg-muted'
                }`}>
                  <Icon />
                </div>
                <div>
                  <p className={`text-[13px] font-medium ${activeTool === tool.id ? 'text-accent' : 'text-fg'}`}>
                    {tool.name}
                  </p>
                  <p className="text-[11px] text-fg-dim">{tool.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Action area */}
      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClean}
              disabled={processing}
              className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-[13px] font-medium text-bg transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {processing ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <IconSparkles className="h-4 w-4" />
                  Run Cleaning
                </>
              )}
            </button>
            {result && (
              <span className="text-[13px] text-accent">{result}</span>
            )}
          </div>
          <span className="text-[12px] text-fg-dim">Active dataset: {activeDataset?.name}</span>
        </div>
      </div>
    </div>
  )
}
