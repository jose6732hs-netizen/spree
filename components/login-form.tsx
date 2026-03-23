'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tenantSlug, setTenantSlug] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Simulação de login - em produção, fazer chamada API
      if (!email || !password) {
        setError('Por favor, preencha email e senha')
        return
      }

      // Armazenar dados em sessionStorage para demo
      sessionStorage.setItem('userEmail', email)
      sessionStorage.setItem('userRole', tenantSlug ? 'tenant-admin' : 'super-admin')
      if (tenantSlug) {
        sessionStorage.setItem('tenantSlug', tenantSlug)
      }

      // Redirecionar
      if (tenantSlug) {
        router.push(`/${tenantSlug}/admin`)
      } else {
        router.push('/super-admin')
      }
    } catch (err) {
      setError('Falha no login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <LogIn className="w-8 h-8 text-blue-600 mr-2" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Spree SaaS</h1>
            <p className="text-sm text-slate-600">Entre em sua conta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Slug da Loja (deixe em branco para Super Admin)
            </label>
            <input
              type="text"
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="exemplo: example-store"
            />
            <p className="text-xs text-slate-500 mt-1">Ex: minha-loja, loja-xyz</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded mt-4">
            <p className="font-semibold mb-1">Demo: Teste com qualquer email/senha</p>
            <p>- Deixe Loja em branco: Super Admin</p>
            <p>- Digite qualquer loja: Tenant Admin</p>
          </div>
        </form>

        <p className="text-center mt-6 text-slate-600">
          Não tem conta?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            Registre-se agora
          </Link>
        </p>
      </div>
    </div>
  )
}
