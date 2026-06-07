import { useApp } from '@/context/AppContext'
import {
  IconDatabase,
  IconTrendUp,
  IconModel,
  IconActivity,
} from '@/icons'

export default function KPICards() {
  const { datasets, models } = useApp()

  const readyModels = models.filter((m) => m.status === 'ready').length
  const totalPredictions = models.reduce((acc, m) => acc + Math.floor(m.accuracy * 1000000), 0)

  const cards = [
    {
      label: 'DATASETS',
      value: datasets.length.toString(),
      change: '+12%',
      changeLabel: 'vs last 30 days',
      icon: IconDatabase,
      iconBg: 'bg-accent-dim',
      iconColor: 'text-accent',
    },
    {
      label: 'METRICS',
      value: '168',
      change: '+8%',
      changeLabel: 'vs last 30 days',
      icon: IconTrendUp,
      iconBg: 'bg-accent-dim',
      iconColor: 'text-accent',
    },
    {
      label: 'MODELS',
      value: readyModels.toString(),
      change: '+5%',
      changeLabel: 'vs last 30 days',
      icon: IconModel,
      iconBg: 'bg-accent-dim',
      iconColor: 'text-accent',
    },
    {
      label: 'PREDICTIONS',
      value: `${(totalPredictions / 1000000).toFixed(2)}M`,
      change: '+23%',
      changeLabel: 'vs last 30 days',
      icon: IconActivity,
      iconBg: 'bg-accent-dim',
      iconColor: 'text-accent',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-lg border border-border bg-bg-card p-4 transition-colors hover:border-border-subtle"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-md ${card.iconBg}`}>
                  <Icon className={card.iconColor} />
                </div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-fg-muted">
                  {card.label}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-[28px] font-semibold leading-none tracking-tight text-fg">
                {card.value}
              </p>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="text-[11px] font-medium text-accent">{card.change}</span>
                <span className="text-[11px] text-fg-dim">{card.changeLabel}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
