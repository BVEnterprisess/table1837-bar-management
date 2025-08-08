import { ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/components/Auth/AuthProvider'
import Navigation from './Navigation'
import type { TabType } from '@/types'

interface LayoutProps {
  children: ReactNode
  activeTab?: TabType
}

export default function Layout({ children, activeTab }: LayoutProps) {
  const { user, userRole, signOut } = useAuth()
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState<TabType>(activeTab || 'dashboard')

  // Determine current tab from route
  useEffect(() => {
    const path = router.pathname
    if (path === '/dashboard') setCurrentTab('dashboard')
    else if (path === '/staff') setCurrentTab('staff')
    else if (path === '/admin') setCurrentTab('admin')
    else if (path === '/wine') setCurrentTab('wine')
    else if (path === '/inventory') setCurrentTab('inventory')
    else if (path === '/cocktails') setCurrentTab('cocktails')
  }, [router.pathname])

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab)
    router.push(`/${tab}`)
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  // Role-based tab visibility
  const getVisibleTabs = () => {
    const allTabs: { key: TabType; label: string; adminOnly?: boolean }[] = [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'cocktails', label: 'Cocktails' },
      { key: 'staff', label: 'Staff' },
      { key: 'admin', label: 'Admin', adminOnly: true },
      { key: 'wine', label: 'Wine' },
      { key: 'inventory', label: 'Inventory' },
    ]

    return allTabs.filter(tab => {
      if (tab.adminOnly && userRole !== 'admin') return false
      return true
    })
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header with Navigation */}
      <header className="bg-black bg-opacity-90 backdrop-filter backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold">TABLE 1837</h1>
              <p className="text-sm text-gray-400">Bar Management</p>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  {user.email} ({userRole})
                </span>
              </div>
            )}
          </div>
          
          {/* Navigation Tabs */}
          <Navigation
            tabs={getVisibleTabs()}
            activeTab={currentTab}
            onTabChange={handleTabChange}
            onLogout={handleLogout}
          />
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  )
}