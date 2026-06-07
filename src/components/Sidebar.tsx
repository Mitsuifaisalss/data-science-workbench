import React, { useState, useRef, useCallback } from 'react'
import { useApp } from '@/context/AppContext'
import {
  Logo,
  IconClose,
  IconHome,
  IconDatabase,
  IconExplore,
  IconModel,
  IconEvaluate,
  IconPredict,
  IconMonitor,
  IconReport,
  IconSettings,
  IconIntegrations,
  IconTeam,
  IconAudit,
  IconChevronLeft,
} from '@/icons'

const navItems = [
  { icon: IconHome, label: 'Overview', active: true },
  { icon: IconDatabase, label: 'Data' },
  { icon: IconExplore, label: 'Explore' },
  { icon: IconModel, label: 'Models' },
  { icon: IconEvaluate, label: 'Evaluate' },
  { icon: IconPredict, label: 'Predict' },
  { icon: IconMonitor, label: 'Monitor' },
  { icon: IconReport, label: 'Reports' },
]

const bottomItems = [
  { icon: IconSettings, label: 'Settings' },
  { icon: IconIntegrations, label: 'Integrations' },
  { icon: IconTeam, label: 'Team' },
  { icon: IconAudit, label: 'Audit Log' },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, closeMobileSidebar } = useApp()
  const [activeNav, setActiveNav] = useState('Overview')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // In a real app, parse and add to datasets
    alert(`Uploaded: ${file.name}`)
  }, [])

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-border bg-bg-elevated transition-all duration-300 lg:static lg:z-auto ${
        mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      } ${
        sidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-[220px]'
      }`}
    >
      {/* Logo */}
      <div className="flex h-[56px] items-center gap-2.5 border-b border-border px-4">
        <Logo className="shrink-0" />
        {!sidebarCollapsed && (
          <span className="font-display text-[13px] font-semibold tracking-wide text-fg">
            DATAFORGE
          </span>
        )}
        <button
          onClick={closeMobileSidebar}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg lg:hidden"
          aria-label="Close navigation"
        >
          <IconClose />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeNav === item.label
            return (
              <li key={item.label}>
                <button
                  onClick={() => setActiveNav(item.label)}
                  onMouseUp={() => closeMobileSidebar()}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[13px] transition-colors ${
                    isActive
                      ? 'bg-accent-dim text-accent'
                      : 'text-fg-muted hover:bg-bg-hover hover:text-fg'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`shrink-0 ${isActive ? 'text-accent' : ''}`} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Divider */}
        <div className="mx-3 my-3 h-px bg-border" />

        <ul className="space-y-0.5 px-2">
          {bottomItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.label}>
                <button
                  onClick={() => setActiveNav(item.label)}
                  onMouseUp={() => closeMobileSidebar()}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[13px] text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg"
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-md py-2 text-fg-dim transition-colors hover:bg-bg-hover hover:text-fg"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <IconChevronLeft
            className={`transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
          />
          {!sidebarCollapsed && <span className="text-[12px]">Collapse</span>}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".csv,.json,.xlsx,.parquet"
        onChange={handleFileUpload}
      />
    </aside>
  )
}
