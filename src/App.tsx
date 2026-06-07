import { AppProvider } from '@/context/AppContext'
import Dashboard from '@/sections/Dashboard'

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}
