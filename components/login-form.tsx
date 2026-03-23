'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tenantSlug, setTenantSlug] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password, tenantSlug || undefined)
      if (tenantSlug) {
        router.push(`/${tenantSlug}/admin`)
      } else {
        router.push('/super-admin')
      }
    } catch (err) {
      setError('Falha no login. Verifique seus dados.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-900">Spree Commerce</h1>
        <p className="text-center text-gray-600 mb-8">SaaS Multi-Tenant</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loja (opcional - deixe em branco para Super Admin)</label>
            <input
              type="text"
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="minha-loja"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Não tem conta?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            Crie uma agora
          </Link>
        </p>
      </div>
    </div>
  )
}
