import React, { createContext, useContext, useState, useCallback } from 'react'
import { parseDatasetFile } from '@/utils/datasetParser'

export interface Dataset {
  id: string
  name: string
  rows: number
  columns: number
  size: string
  uploadedAt: string
  headers: string[]
  data: Record<string, string | number | null>[]
  types: Record<string, string>
}

export interface Model {
  id: string
  name: string
  type: string
  status: 'training' | 'ready' | 'failed'
  accuracy: number
  dataset: string
  createdAt: string
}

interface AppState {
  datasets: Dataset[]
  models: Model[]
  activeDataset: Dataset | null
  activeTab: string
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  isImporting: boolean
  importError: string | null
  addDataset: (dataset: Dataset) => void
  removeDataset: (id: string) => void
  setActiveDataset: (dataset: Dataset | null) => void
  addModel: (model: Model) => void
  setActiveTab: (tab: string) => void
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  importDataset: (file: File) => Promise<void>
}

const defaultDatasets: Dataset[] = [
  {
    id: '1',
    name: 'customer_churn.csv',
    rows: 10000,
    columns: 21,
    size: '2.4 MB',
    uploadedAt: 'May 16, 2025  10:24 AM',
    headers: ['customer_id', 'age', 'tenure_months', 'monthly_charges', 'total_charges', 'contract_type', 'churn', 'join_date'],
    data: [
      { customer_id: 10001, age: 34, tenure_months: 12, monthly_charges: 65.50, total_charges: 786.00, contract_type: 'Month-to-month', churn: 1, join_date: '2023-04-18' },
      { customer_id: 10002, age: 28, tenure_months: 24, monthly_charges: 89.99, total_charges: 2159.76, contract_type: 'One year', churn: 0, join_date: '2022-09-03' },
      { customer_id: 10003, age: 45, tenure_months: 6, monthly_charges: 45.00, total_charges: 270.00, contract_type: 'Month-to-month', churn: 1, join_date: '2024-01-27' },
      { customer_id: 10004, age: 52, tenure_months: 36, monthly_charges: 120.00, total_charges: 4320.00, contract_type: 'Two year', churn: 0, join_date: '2021-08-11' },
      { customer_id: 10005, age: 23, tenure_months: 3, monthly_charges: 39.99, total_charges: 119.97, contract_type: 'Month-to-month', churn: 1, join_date: '2024-03-14' },
    ],
    types: { customer_id: 'numeric', age: 'numeric', tenure_months: 'numeric', monthly_charges: 'numeric', total_charges: 'numeric', contract_type: 'categorical', churn: 'binary', join_date: 'date' },
  },
  {
    id: '2',
    name: 'transactions_2025.parquet',
    rows: 245000,
    columns: 14,
    size: '18.7 MB',
    uploadedAt: 'May 15, 2025  4:18 PM',
    headers: ['txn_id', 'amount', 'merchant', 'category', 'timestamp', 'fraud'],
    data: [
      { txn_id: 'TXN-001', amount: 125.50, merchant: 'Amazon', category: 'Retail', timestamp: '2025-01-15', fraud: 0 },
      { txn_id: 'TXN-002', amount: 2400.00, merchant: 'Unknown', category: 'Transfer', timestamp: '2025-01-15', fraud: 1 },
      { txn_id: 'TXN-003', amount: 45.99, merchant: 'Starbucks', category: 'Food', timestamp: '2025-01-16', fraud: 0 },
      { txn_id: 'TXN-004', amount: 899.00, merchant: 'Best Buy', category: 'Electronics', timestamp: '2025-01-16', fraud: 0 },
      { txn_id: 'TXN-005', amount: 3200.00, merchant: 'Unknown', category: 'Transfer', timestamp: '2025-01-17', fraud: 1 },
    ],
    types: { txn_id: 'string', amount: 'numeric', merchant: 'categorical', category: 'categorical', timestamp: 'date', fraud: 'binary' },
  },
  {
    id: '3',
    name: 'marketing_campaign.xlsx',
    rows: 5000,
    columns: 12,
    size: '1.1 MB',
    uploadedAt: 'May 14, 2025  2:03 PM',
    headers: ['campaign_id', 'channel', 'spend', 'impressions', 'clicks', 'conversions', 'revenue'],
    data: [
      { campaign_id: 'CMP-001', channel: 'Google Ads', spend: 5000, impressions: 125000, clicks: 3200, conversions: 180, revenue: 27000 },
      { campaign_id: 'CMP-002', channel: 'Facebook', spend: 3500, impressions: 98000, clicks: 2100, conversions: 95, revenue: 14250 },
      { campaign_id: 'CMP-003', channel: 'Email', spend: 800, impressions: 45000, clicks: 1800, conversions: 120, revenue: 18000 },
      { campaign_id: 'CMP-004', channel: 'LinkedIn', spend: 4200, impressions: 67000, clicks: 1500, conversions: 65, revenue: 16250 },
      { campaign_id: 'CMP-005', channel: 'TikTok', spend: 2800, impressions: 210000, clicks: 5400, conversions: 210, revenue: 31500 },
    ],
    types: { campaign_id: 'string', channel: 'categorical', spend: 'numeric', impressions: 'numeric', clicks: 'numeric', conversions: 'numeric', revenue: 'numeric' },
  },
  {
    id: '4',
    name: 'web_analytics.json',
    rows: 8760,
    columns: 9,
    size: '4.2 MB',
    uploadedAt: 'May 13, 2025  11:47 AM',
    headers: ['timestamp', 'page', 'visitors', 'bounce_rate', 'avg_duration', 'device'],
    data: [
      { timestamp: '2025-01-01', page: '/home', visitors: 4520, bounce_rate: 0.32, avg_duration: 145, device: 'Desktop' },
      { timestamp: '2025-01-01', page: '/products', visitors: 3210, bounce_rate: 0.28, avg_duration: 210, device: 'Mobile' },
      { timestamp: '2025-01-02', page: '/home', visitors: 4890, bounce_rate: 0.30, avg_duration: 152, device: 'Desktop' },
      { timestamp: '2025-01-02', page: '/blog', visitors: 1890, bounce_rate: 0.45, avg_duration: 320, device: 'Tablet' },
      { timestamp: '2025-01-03', page: '/home', visitors: 5100, bounce_rate: 0.29, avg_duration: 148, device: 'Mobile' },
    ],
    types: { timestamp: 'date', page: 'categorical', visitors: 'numeric', bounce_rate: 'numeric', avg_duration: 'numeric', device: 'categorical' },
  },
  {
    id: '5',
    name: 'product_data.csv',
    rows: 3200,
    columns: 8,
    size: '0.8 MB',
    uploadedAt: 'May 12, 2025  9:31 AM',
    headers: ['product_id', 'name', 'category', 'price', 'rating', 'reviews', 'stock'],
    data: [
      { product_id: 'PRD-001', name: 'Wireless Headphones', category: 'Electronics', price: 129.99, rating: 4.5, reviews: 2340, stock: 150 },
      { product_id: 'PRD-002', name: 'Yoga Mat', category: 'Fitness', price: 34.99, rating: 4.8, reviews: 1890, stock: 320 },
      { product_id: 'PRD-003', name: 'Coffee Maker', category: 'Kitchen', price: 89.99, rating: 4.2, reviews: 876, stock: 45 },
      { product_id: 'PRD-004', name: 'Running Shoes', category: 'Fitness', price: 119.99, rating: 4.6, reviews: 3420, stock: 89 },
      { product_id: 'PRD-005', name: 'Desk Lamp', category: 'Home', price: 45.99, rating: 4.3, reviews: 567, stock: 200 },
    ],
    types: { product_id: 'string', name: 'string', category: 'categorical', price: 'numeric', rating: 'numeric', reviews: 'numeric', stock: 'numeric' },
  },
]

const defaultModels: Model[] = [
  { id: 'm1', name: 'Churn Predictor v3', type: 'XGBoost', status: 'ready', accuracy: 0.86, dataset: 'customer_churn.csv', createdAt: 'May 10, 2025' },
  { id: 'm2', name: 'Fraud Detector', type: 'Random Forest', status: 'ready', accuracy: 0.92, dataset: 'transactions_2025.parquet', createdAt: 'May 8, 2025' },
  { id: 'm3', name: 'Campaign Optimizer', type: 'Neural Network', status: 'training', accuracy: 0.74, dataset: 'marketing_campaign.xlsx', createdAt: 'May 6, 2025' },
  { id: 'm4', name: 'Traffic Forecaster', type: 'LSTM', status: 'ready', accuracy: 0.81, dataset: 'web_analytics.json', createdAt: 'May 4, 2025' },
  { id: 'm5', name: 'Price Recommender', type: 'Linear Regression', status: 'failed', accuracy: 0.63, dataset: 'product_data.csv', createdAt: 'May 2, 2025' },
  { id: 'm6', name: 'Sentiment Analyzer', type: 'BERT', status: 'training', accuracy: 0.78, dataset: 'customer_churn.csv', createdAt: 'May 1, 2025' },
  { id: 'm7', name: 'Anomaly Detector', type: 'Isolation Forest', status: 'ready', accuracy: 0.89, dataset: 'transactions_2025.parquet', createdAt: 'Apr 28, 2025' },
]

const AppContext = createContext<AppState | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [datasets, setDatasets] = useState<Dataset[]>(defaultDatasets)
  const [models, setModels] = useState<Model[]>(defaultModels)
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(defaultDatasets[0])
  const [activeTab, setActiveTab] = useState('DATA PREVIEW')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const addDataset = useCallback((dataset: Dataset) => {
    setDatasets(prev => [dataset, ...prev])
    setActiveDataset(dataset)
    setActiveTab('DATA PREVIEW')
  }, [])

  const removeDataset = useCallback((id: string) => {
    setDatasets(prev => {
      const next = prev.filter(d => d.id !== id)
      if (activeDataset?.id === id) {
        setActiveDataset(next[0] || null)
      }
      return next
    })
  }, [activeDataset])

  const addModel = useCallback((model: Model) => {
    setModels(prev => [model, ...prev])
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(prev => !prev)
  }, [])

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false)
  }, [])

  const importDataset = useCallback(async (file: File) => {
    setIsImporting(true)
    setImportError(null)

    try {
      const dataset = await parseDatasetFile(file)
      setDatasets(prev => [dataset, ...prev])
      setActiveDataset(dataset)
      setActiveTab('DATA PREVIEW')
      setMobileSidebarOpen(false)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Unable to import this dataset.')
    } finally {
      setIsImporting(false)
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        datasets,
        models,
        activeDataset,
        activeTab,
        sidebarCollapsed,
        mobileSidebarOpen,
        isImporting,
        importError,
        addDataset,
        removeDataset,
        setActiveDataset,
        addModel,
        setActiveTab,
        toggleSidebar,
        toggleMobileSidebar,
        closeMobileSidebar,
        importDataset,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
