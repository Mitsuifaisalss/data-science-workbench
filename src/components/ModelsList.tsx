import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import {
  IconBrain,
} from '@/icons'

export default function ModelsList() {
  const { models } = useApp()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? models : models.filter((m) => m.status === filter)

  const statusColors: Record<string, string> = {
    ready: 'text-accent',
    training: 'text-warning',
    failed: 'text-danger',
  }

  const statusBg: Record<string, string> = {
    ready: 'bg-accent-dim',
    training: 'bg-warning/10',
    failed: 'bg-danger/10',
  }

  return (
    <div className="rounded-lg border border-border bg-bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-[13px] font-semibold text-fg">Trained Models</h3>
        <div className="flex items-center gap-1">
          {['all', 'ready', 'training', 'failed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                filter === f
                  ? 'bg-accent-dim text-accent'
                  : 'text-fg-muted hover:bg-bg-hover hover:text-fg'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-border">
        {filtered.map((model) => (
          <div key={model.id} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-bg-hover">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${statusBg[model.status]}`}>
              <IconBrain className={statusColors[model.status]} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-medium text-fg">{model.name}</p>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${statusBg[model.status]} ${statusColors[model.status]}`}>
                  {model.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-fg-dim">{model.type}</span>
                <span className="text-[11px] text-fg-dim">{model.dataset}</span>
                <span className="text-[11px] text-fg-dim">{model.createdAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[16px] font-semibold text-fg">{(model.accuracy * 100).toFixed(0)}%</p>
                <p className="text-[11px] text-fg-dim">Accuracy</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <button className="rounded-md px-2 py-1 text-[12px] text-accent transition-colors hover:bg-accent-dim">
                Deploy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
