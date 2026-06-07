import { useState, useRef, useCallback } from 'react'
import { useApp } from '@/context/AppContext'
import {
  IconMenu,
  IconSearch,
  IconBell,
  IconHelp,
  IconChevronDown,
  IconUpload,
} from '@/icons'

export default function TopNav() {
  const { importDataset, isImporting, importError, toggleMobileSidebar } = useApp()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    void importDataset(file)
    e.target.value = ''
  }, [importDataset])

  return (
    <header className="border-b border-border bg-bg-elevated px-3 py-3 lg:h-[56px] lg:px-4 lg:py-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleMobileSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-card text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg"
            aria-label="Open navigation"
          >
            <IconMenu />
          </button>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-fg-dim">Workspace</p>
            <p className="text-[15px] font-medium text-fg">DataForge</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
        {['Workbench', 'Datasets', 'Models', 'Experiments', 'Notebooks', 'Pipelines', 'Deployments'].map((tab) => (
          <button
            key={tab}
            className={`shrink-0 rounded-md px-3 py-1.5 text-[13px] transition-colors ${
              tab === 'Workbench'
                ? 'bg-accent-dim text-accent'
                : 'text-fg-muted hover:bg-bg-hover hover:text-fg'
            }`}
          >
            {tab}
          </button>
        ))}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-2 lg:flex-nowrap lg:justify-end">
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg">
              <IconSearch />
            </button>
            <button className="relative flex h-8 w-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg">
              <IconBell />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg">
              <IconHelp />
            </button>
          </div>

          <div className="hidden h-5 w-px bg-border lg:block" />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="flex min-h-[40px] items-center gap-2 rounded-md bg-accent px-3 py-2 text-[13px] font-medium text-bg transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IconUpload className="text-bg" />
            {isImporting ? 'Importing…' : 'Upload Dataset'}
          </button>

          <div className="hidden h-5 w-px bg-border lg:block" />

          <div className="relative">
            <button
              onClick={() => {
                setShowProfileDropdown(!showProfileDropdown)
              }}
              className="flex items-center gap-2 rounded-md px-2 py-1 text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-border text-[11px] font-semibold text-fg">
                AK
              </div>
              <IconChevronDown className={`transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-bg-card py-1 shadow-lg">
                <div className="px-3 py-2">
                  <p className="text-[13px] font-medium text-fg">Alex Kim</p>
                  <p className="text-[11px] text-fg-dim">alex@dataforge.ai</p>
                </div>
                <div className="h-px bg-border" />
                <button className="w-full px-3 py-2 text-left text-[13px] text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg">Profile</button>
                <button className="w-full px-3 py-2 text-left text-[13px] text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg">Settings</button>
                <button className="w-full px-3 py-2 text-left text-[13px] text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg">API Keys</button>
                <div className="h-px bg-border" />
                <button className="w-full px-3 py-2 text-left text-[13px] text-danger transition-colors hover:bg-bg-hover">Sign out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {importError && (
        <div className="mt-2 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[12px] text-danger lg:mt-0">
          {importError}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".csv,.tsv,.json,.xlsx,.xls,.parquet,.txt"
        onChange={handleFileUpload}
      />
    </header>
  )
}
