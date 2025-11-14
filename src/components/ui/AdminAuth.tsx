'use client'

import { useState, useEffect } from 'react'
import Button from './Button'
import Input from './Input'
import { Lock } from 'lucide-react'

interface AdminAuthProps {
  children: React.ReactNode
}

const ADMIN_PASSWORD = 'admin123' // In production, use environment variables and proper authentication
const AUTH_KEY = 'admin_authenticated'
const AUTH_EXPIRY = 'admin_auth_expiry'
const SESSION_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authenticated = localStorage.getItem(AUTH_KEY)
      const expiry = localStorage.getItem(AUTH_EXPIRY)

      if (authenticated === 'true' && expiry) {
        const expiryTime = parseInt(expiry, 10)
        if (Date.now() < expiryTime) {
          setIsAuthenticated(true)
        } else {
          // Session expired
          localStorage.removeItem(AUTH_KEY)
          localStorage.removeItem(AUTH_EXPIRY)
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === ADMIN_PASSWORD) {
      const expiryTime = Date.now() + SESSION_DURATION
      localStorage.setItem(AUTH_KEY, 'true')
      localStorage.setItem(AUTH_EXPIRY, expiryTime.toString())
      setIsAuthenticated(true)
      setPassword('')
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(AUTH_EXPIRY)
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-100 p-4 rounded-full">
              <Lock className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
          <p className="text-gray-600 text-center mb-6">
            Please enter the admin password to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!password}
            >
              Login
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Credentials:</strong>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Password: <code className="bg-blue-100 px-2 py-1 rounded">admin123</code>
            </p>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Session expires after 1 hour of inactivity
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {children}
      {/* Logout button in the corner */}
      <button
        type="button"
        onClick={handleLogout}
        className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors text-sm font-medium z-50"
      >
        Logout
      </button>
    </>
  )
}

