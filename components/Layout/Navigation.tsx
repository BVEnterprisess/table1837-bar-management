import type { TabType } from '@/types'

interface Tab {
  key: TabType
  label: string
  adminOnly?: boolean
}

interface NavigationProps {
  tabs: Tab[]
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onLogout: () => void
}

export default function Navigation({ tabs, activeTab, onTabChange, onLogout }: NavigationProps) {
  return (
    <nav className="flex space-x-1 mt-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`nav-tab ${
            activeTab === tab.key ? 'active' : ''
          }`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
      
      <button
        className="nav-tab ml-auto"
        onClick={onLogout}
      >
        <i className="fas fa-sign-out-alt mr-1"></i>
        Logout
      </button>
    </nav>
  )
}