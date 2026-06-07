import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import {
  IconSparkles,
  IconWand,
  IconBrain,
} from '@/icons'

const tools = [
  {
    id: 'eda',
    name: 'Auto EDA',
    description: 'Automatically generate exploratory data analysis reports with statistics, distributions, and insights.',
    icon: IconSparkles,
    action: 'Run EDA',
  },
  {
    id: 'feature',
    name: 'Feature Importance',
    description: 'Identify the most important features in your dataset using statistical methods.',
    icon: IconWand,
    action: 'Analyze',
  },
  {
    id: 'predict',
    name: 'Quick Predict',
    description: 'Make predictions using your trained models without writing any code.',
    icon: IconBrain,
    action: 'Predict',
  },
  {
    id: 'compare',
    name: 'Model Comparison',
    description: 'Compare multiple models side-by-side with metrics, charts, and performance analysis.',
    icon: IconSparkles,
    action: 'Compare',
  },
  {
    id: 'export',
    name: 'Export Pipeline',
    description: 'Export your complete data processing and model training pipeline as Python code.',
    icon: IconWand,
    action: 'Export',
  },
  {
    id: 'schedule',
    name: 'Schedule Training',
    description: 'Set up automated model retraining on a schedule with email notifications.',
    icon: IconBrain,
    action: 'Schedule',
  },
  {
    id: 'drift',
    name: 'Drift Monitor',
    description: 'Track data drift and concept drift before performance degrades in production.',
    icon: IconSparkles,
    action: 'Monitor',
  },
  {
    id: 'tune',
    name: 'Hyperparameter Search',
    description: 'Launch tuning jobs to find the best model settings automatically.',
    icon: IconWand,
    action: 'Tune',
  },
  {
    id: 'llm',
    name: 'LLM Dataset Builder',
    description: 'Prepare prompt-response datasets, eval sets, and synthetic examples for AI training.',
    icon: IconBrain,
    action: 'Build',
  },
]

export default function QuickToolsPanel() {
  const { activeDataset } = useApp()
  const [running, setRunning] = useState<Record<string, boolean>>({})
  const [results, setResults] = useState<Record<string, string>>({})

  const handleAction = (toolId: string) => {
    setRunning((prev) => ({ ...prev, [toolId]: true }))
    setTimeout(() => {
      setRunning((prev) => ({ ...prev, [toolId]: false }))
      setResults((prev) => ({
        ...prev,
        [toolId]: `Completed! ${activeDataset?.name} processed successfully.`,
      }))
    }, 2000)
  }

  return (
    <div className="rounded-lg border border-border bg-bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-[13px] font-semibold text-fg">Quick Tools</h3>
        <p className="mt-0.5 text-[12px] text-fg-muted">One-click data science operations</p>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon
          const isRunning = running[tool.id]
          const result = results[tool.id]

          return (
            <div
              key={tool.id}
              className="flex flex-col rounded-lg border border-border bg-bg-elevated p-4 transition-colors hover:border-border-subtle"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-accent-dim">
                <Icon className="text-accent" />
              </div>

              <p className="text-[13px] font-medium text-fg">{tool.name}</p>
              <p className="mb-3 mt-1 text-[12px] leading-relaxed text-fg-muted">{tool.description}</p>

              {result && (
                <p className="mb-2 text-[11px] text-accent">{result}</p>
              )}

              <button
                onClick={() => handleAction(tool.id)}
                disabled={isRunning || !activeDataset}
                className="mt-auto flex items-center justify-center gap-1.5 rounded-md border border-border bg-bg-card px-3 py-2 text-[12px] font-medium text-fg transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Running...
                  </>
                ) : (
                  tool.action
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
