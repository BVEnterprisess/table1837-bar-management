import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from './AuthProvider'

export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.push('/')
      }
    }, [user, loading, router])

    if (loading) {
      return (
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <div className="glass-panel p-8 rounded-lg text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      )
    }

    if (!user) {
      return null
    }

    return <Component {...props} />
  }
}