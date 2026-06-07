import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import KPICards from '@/components/KPICards'
import PredictionChart from '@/components/PredictionChart'
import DataTable from '@/components/DataTable'
import FileSidebar from '@/components/FileSidebar'
import DataCleaningPanel from '@/components/DataCleaningPanel'
import DataVizPanel from '@/components/DataVizPanel'
import ModelTrainingPanel from '@/components/ModelTrainingPanel'
import ModelsList from '@/components/ModelsList'
import SyntheticDataPanel from '@/components/SyntheticDataPanel'
import QuickToolsPanel from '@/components/QuickToolsPanel'
import CapabilitiesPanel from '@/components/CapabilitiesPanel'
import { useApp } from '@/context/AppContext'

export default function Dashboard() {
  const { mobileSidebarOpen, closeMobileSidebar } = useApp()

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-bg">
      {mobileSidebarOpen && (
        <button
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/55 lg:hidden"
          aria-label="Close navigation overlay"
        />
      )}

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />

        <div className="flex flex-1 overflow-hidden">
          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
            <div className="space-y-5 p-4 lg:p-5">
              {/* Hero */}
              <div>
                <h1 className="text-[24px] font-semibold tracking-tight text-fg sm:text-[28px]">
                  Data Science Workbench
                </h1>
                <p className="mt-1 text-[14px] text-fg-muted">
                  Build, evaluate, and deploy data-driven models
                </p>
              </div>

              {/* KPI Cards */}
              <KPICards />

              <div className="xl:hidden">
                <FileSidebar embedded />
              </div>

              {/* Quick Tools */}
              <QuickToolsPanel />

              <CapabilitiesPanel />

              {/* Data Cleaning */}
              <DataCleaningPanel />

              {/* Data Visualization */}
              <DataVizPanel />

              {/* Chart */}
              <PredictionChart />

              {/* Model Training */}
              <ModelTrainingPanel />

              {/* Models List */}
              <ModelsList />

              {/* Synthetic Data */}
              <SyntheticDataPanel />

              {/* Data Table */}
              <DataTable />
            </div>
          </div>

          <aside className="hidden w-[320px] shrink-0 border-l border-border bg-bg-elevated xl:block">
            <FileSidebar />
          </aside>
        </div>
      </div>
    </div>
  )
}
