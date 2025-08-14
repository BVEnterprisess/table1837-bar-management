import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'
import Head from 'next/head'

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

    // Demo credentials check first
    if (email === 'user@table1837.com' && password === 'password123') {
      router.push('/dashboard')
      return
    }

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
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Table 1837 - Bar Management System</title>
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" />
      </Head>
      <div 
        className="login-bg min-h-screen flex items-center justify-center"
        style={{
          fontFamily: 'EB Garamond, serif',
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.stockcake.com/public/f/3/c/f3cab94a-6edb-44f9-adf2-c82fa6e8b374_large/elegant-cocktail-evening-stockcake.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div 
          className="glass-panel p-8 rounded-lg w-full max-w-md mx-4"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-white">TABLE 1837</h1>
            <p className="text-gray-300 text-lg">Glen Rock Mill Inn</p>
            <p className="text-gray-400">Bar Management System</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Username</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:border-green-600 text-white"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-lg focus:outline-none focus:border-green-600 text-white"
                placeholder="Enter your password"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 px-6 rounded-lg font-semibold text-lg transition duration-300 disabled:opacity-50"
              style={{
                backgroundColor: '#1a3b1a',
                borderColor: '#1a3b1a'
              }}
            >
              {loading ? 'Logging in...' : 'ACCESS INVENTORY SYSTEM'}
            </button>
            
            <div className="text-center text-sm text-gray-400">
              <p>Demo Credentials:</p>
              <p>user@table1837.com / password123</p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}