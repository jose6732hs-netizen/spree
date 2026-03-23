'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthSession, User, Tenant } from './types'

interface AuthContextType {
  session: AuthSession | null
  user: User | null
  tenant: Tenant | null
  isLoading: boolean
  login: (email: string, password: string, tenantSlug?: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, tenantName: string) => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de sessão do localStorage (em produção seria uma API call)
    const storedSession = localStorage.getItem('auth_session')
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession))
      } catch (e) {
        console.error('Failed to parse session:', e)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, tenantSlug?: string) => {
    setIsLoading(true)
    try {
      // Em produção, isso seria uma chamada API real
      const mockSession: AuthSession = {
        user: {
          id: '1',
          email,
          name: email.split('@')[0],
          role: tenantSlug ? 'tenant_admin' : 'super_admin',
          tenant_id: tenantSlug,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        tenant: tenantSlug
          ? {
              id: '1',
              name: tenantSlug,
              slug: tenantSlug,
              email,
              theme_color: '#0066cc',
              status: 'active',
              subscription_tier: 'pro',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : null,
        token: 'mock_token_' + Math.random().toString(36).substr(2, 9),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
      setSession(mockSession)
      localStorage.setItem('auth_session', JSON.stringify(mockSession))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setSession(null)
    localStorage.removeItem('auth_session')
  }

  const register = async (email: string, password: string, tenantName: string) => {
    setIsLoading(true)
    try {
      // Em produção, isso seria uma chamada API real
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await login(email, password, tenantName.toLowerCase().replace(/\s+/g, '-'))
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    session,
    user: session?.user || null,
    tenant: session?.tenant || null,
    isLoading,
    login,
    logout,
    register,
    isAuthenticated: !!session,
    isAdmin: session?.user.role === 'tenant_admin' || session?.user.role === 'super_admin',
    isSuperAdmin: session?.user.role === 'super_admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
