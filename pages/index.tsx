import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkUser()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="login-bg min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 rounded-lg w-full max-w-md mx-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">TABLE 1837</h1>
            <p className="text-gray-300 text-lg">Glen Rock Mill Inn</p>
            <p className="text-gray-400">Bar Management System</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-3 text-red-300">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:border-green-600 text-white" 
                placeholder="Enter your email" 
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:border-green-600 text-white" 
                placeholder="Enter your password" 
                required
                disabled={loading}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-3 px-6 rounded-lg font-semibold text-lg hover:bg-opacity-80 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'ACCESS INVENTORY SYSTEM'
              )}
            </button>
            
            <div className="text-center text-sm text-gray-400">
              <p>Demo Credentials:</p>
              <p>user@table1837.com / password123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}