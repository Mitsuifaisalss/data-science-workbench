const capabilityGroups = [
  {
    title: 'Data Ingestion',
    items: ['CSV / JSON / XLSX / Parquet', 'Schema detection', 'Type inference', 'Dataset preview'],
  },
  {
    title: 'Preparation',
    items: ['Missing values', 'Duplicates', 'Outliers', 'Encoding', 'Scaling', 'Feature engineering'],
  },
  {
    title: 'Analysis',
    items: ['Auto EDA', 'Correlations', 'Distributions', 'Target analysis', 'Feature importance'],
  },
  {
    title: 'Machine Learning',
    items: ['Classification', 'Regression', 'Clustering', 'Anomaly detection', 'Synthetic training data'],
  },
  {
    title: 'MLOps',
    items: ['Experiment tracking', 'Model registry', 'Deploy actions', 'Drift monitoring', 'Scheduled retraining'],
  },
  {
    title: 'AI-Native Workflows',
    items: ['Prompt datasets', 'LLM evaluation', 'Pipeline export', 'Quick predictions'],
  },
]

export default function CapabilitiesPanel() {
  return (
    <div className="rounded-lg border border-border bg-bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-[13px] font-semibold text-fg">Modern Data Science Stack</h3>
        <p className="mt-0.5 text-[12px] text-fg-muted">A full workbench for today’s analytics, ML, and AI workflows</p>
      </div>

      <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
        {capabilityGroups.map((group) => (
          <div key={group.title} className="rounded-lg border border-border bg-bg-elevated p-4">
            <p className="text-[13px] font-medium text-fg">{group.title}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-bg-card px-2.5 py-1 text-[11px] text-fg-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}