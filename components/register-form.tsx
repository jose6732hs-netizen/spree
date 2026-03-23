'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Store } from 'lucide-react'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [storeName, setStoreName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !storeName) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      // Simulação de registro
      const storeSlug = storeName.toLowerCase().replace(/\s+/g, '-')
      
      // Armazenar dados em sessionStorage para demo
      sessionStorage.setItem('userEmail', email)
      sessionStorage.setItem('tenantSlug', storeSlug)
      sessionStorage.setItem('tenantName', storeName)
      sessionStorage.setItem('userRole', 'tenant-admin')

      // Redirecionar para admin da loja
      router.push(`/${storeSlug}/admin`)
    } catch (err) {
      setError('Falha no registro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-8">
          <Store className="w-8 h-8 text-blue-600 mr-2" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Criar Loja</h1>
            <p className="text-sm text-slate-600">Na Spree SaaS</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nome da Loja</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Tech Store"
            />
            <p className="text-xs text-slate-500 mt-1">URL será: {storeName.toLowerCase().replace(/\s+/g, '-')}.spree.com</p>
          </div>

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
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Criando loja...' : 'Criar Loja Agora'}
          </button>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded">
            <p className="font-semibold mb-1">Demo: Crie sua loja teste</p>
            <p>Você será redirecionado para o painel de admin da sua loja</p>
          </div>
        </form>

        <p className="text-center mt-6 text-slate-600">
          Já tem loja?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
