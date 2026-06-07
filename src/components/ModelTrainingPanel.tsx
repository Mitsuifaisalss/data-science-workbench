import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import {
  IconBrain,
  IconSparkles,
} from '@/icons'

const modelTypes = [
  { id: 'xgboost', name: 'XGBoost', description: 'Gradient boosting framework', bestFor: 'Tabular data, competitions' },
  { id: 'randomforest', name: 'Random Forest', description: 'Ensemble of decision trees', bestFor: 'General purpose, robust' },
  { id: 'neural', name: 'Neural Network', description: 'Deep learning model', bestFor: 'Complex patterns, images' },
  { id: 'linear', name: 'Linear Regression', description: 'Simple linear model', bestFor: 'Baseline, interpretability' },
  { id: 'svm', name: 'SVM', description: 'Support Vector Machine', bestFor: 'High dimensional data' },
  { id: 'kmeans', name: 'K-Means', description: 'Clustering algorithm', bestFor: 'Unsupervised grouping' },
]

const tasks = [
  { id: 'classification', name: 'Classification', description: 'Predict categories' },
  { id: 'regression', name: 'Regression', description: 'Predict continuous values' },
  { id: 'clustering', name: 'Clustering', description: 'Group similar data' },
  { id: 'anomaly', name: 'Anomaly Detection', description: 'Find outliers' },
]

export default function ModelTrainingPanel() {
  const { activeDataset, addModel } = useApp()
  const [selectedModel, setSelectedModel] = useState('xgboost')
  const [selectedTask, setSelectedTask] = useState('classification')
  const [training, setTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [newModelName, setNewModelName] = useState('')

  const handleTrain = () => {
    if (!newModelName.trim()) return
    setTraining(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + Math.random() * 15
      })
    }, 300)

    setTimeout(() => {
      clearInterval(interval)
      setTraining(false)
      setProgress(100)

      const modelType = modelTypes.find((m) => m.id === selectedModel)
      addModel({
        id: `m${Date.now()}`,
        name: newModelName,
        type: modelType?.name || 'Unknown',
        status: 'ready',
        accuracy: 0.7 + Math.random() * 0.25,
        dataset: activeDataset?.name || 'unknown',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      })
      setNewModelName('')
      setProgress(0)
    }, 3500)
  }

  return (
    <div className="rounded-lg border border-border bg-bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-[13px] font-semibold text-fg">AI Model Training</h3>
        <p className="mt-0.5 text-[12px] text-fg-muted">Train machine learning models on your data</p>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-2">
        {/* Model selection */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Select Model</p>
          <div className="space-y-2">
            {modelTypes.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                  selectedModel === model.id
                    ? 'border-accent bg-accent-dim'
                    : 'border-border bg-bg-elevated hover:border-border-subtle'
                }`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                  selectedModel === model.id ? 'bg-accent text-bg' : 'bg-bg-hover text-fg-muted'
                }`}>
                  <IconBrain />
                </div>
                <div className="min-w-0">
                  <p className={`text-[13px] font-medium ${selectedModel === model.id ? 'text-accent' : 'text-fg'}`}>
                    {model.name}
                  </p>
                  <p className="truncate text-[11px] text-fg-dim">{model.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Task & config */}
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Task Type</p>
            <div className="grid grid-cols-2 gap-2">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task.id)}
                  className={`rounded-lg border px-3 py-2 text-left transition-all ${
                    selectedTask === task.id
                      ? 'border-accent bg-accent-dim'
                      : 'border-border bg-bg-elevated hover:border-border-subtle'
                  }`}
                >
                  <p className={`text-[13px] font-medium ${selectedTask === task.id ? 'text-accent' : 'text-fg'}`}>
                    {task.name}
                  </p>
                  <p className="text-[11px] text-fg-dim">{task.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Model Name</p>
            <input
              type="text"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              placeholder="Enter model name..."
              className="w-full rounded-lg border border-border bg-bg-input px-3 py-2 text-[13px] text-fg outline-none placeholder:text-fg-dim focus:border-accent"
            />
          </div>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">Dataset</p>
            <div className="rounded-lg border border-border bg-bg-elevated px-3 py-2">
              <p className="text-[13px] text-fg">{activeDataset?.name || 'No dataset selected'}</p>
              <p className="text-[11px] text-fg-dim">
                {activeDataset ? `${activeDataset.rows.toLocaleString()} rows x ${activeDataset.columns} columns` : ''}
              </p>
            </div>
          </div>

          {/* Progress */}
          {training && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[12px] text-fg-muted">Training...</span>
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
            onClick={handleTrain}
            disabled={training || !newModelName.trim() || !activeDataset}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-[13px] font-medium text-bg transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            <IconSparkles className="h-4 w-4" />
            {training ? 'Training Model...' : 'Train Model'}
          </button>
        </div>
      </div>
    </div>
  )
}
