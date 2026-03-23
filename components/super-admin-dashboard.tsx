'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Tenant } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export function SuperAdminDashboard() {
  const { isAuthenticated, isSuperAdmin, logout } = useAuth()
  const router = useRouter()
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'Loja Premium',
      slug: 'loja-premium',
      email: 'admin@lojapreimum.com',
      theme_color: '#FF6B6B',
      status: 'active',
      subscription_tier: 'enterprise',
      created_at: '2024-01-15',
      updated_at: '2024-03-20',
    },
    {
      id: '2',
      name: 'Loja Growth',
      slug: 'loja-growth',
      email: 'admin@lojagrowth.com',
      theme_color: '#4ECDC4',
      status: 'active',
      subscription_tier: 'pro',
      created_at: '2024-02-10',
      updated_at: '2024-03-18',
    },
    {
      id: '3',
      name: 'Loja Trial',
      slug: 'loja-trial',
      email: 'admin@lojatrial.com',
      theme_color: '#95E1D3',
      status: 'trial',
      subscription_tier: 'free',
      created_at: '2024-03-01',
      updated_at: '2024-03-22',
    },
  ])

  const [metrics, setMetrics] = useState({
    totalTenants: 3,
    activeTenants: 2,
    totalRevenue: 45800,
    growthRate: 12.5,
  })

  const chartData = [
    { month: 'Jan', revenue: 8000, users: 120 },
    { month: 'Fev', revenue: 12000, users: 200 },
    { month: 'Mar', revenue: 15800, users: 350 },
    { month: 'Abr', revenue: 9800, users: 280 },
  ]

  useEffect(() => {
    if (!isAuthenticated || !isSuperAdmin) {
      router.push('/login')
    }
  }, [isAuthenticated, isSuperAdmin, router])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const handleSuspendTenant = (tenantId: string) => {
    setTenants(
      tenants.map((t) => (t.id === tenantId ? { ...t, status: t.status === 'active' ? 'suspended' : 'active' } : t))
    )
  }

  if (!isAuthenticated || !isSuperAdmin) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600">Gerenciar tenants e métricas globais</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm font-semibold">Total de Tenants</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.totalTenants}</p>
            <p className="text-green-600 text-xs mt-2">+2 este mês</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-semibold">Tenants Ativos</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.activeTenants}</p>
            <p className="text-green-600 text-xs mt-2">98% uptime</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
            <p className="text-gray-600 text-sm font-semibold">Receita Total</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">R$ {metrics.totalRevenue.toLocaleString('pt-BR')}</p>
            <p className="text-green-600 text-xs mt-2">+{metrics.growthRate}% vs mês anterior</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm font-semibold">Taxa de Crescimento</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.growthRate}%</p>
            <p className="text-green-600 text-xs mt-2">Aceleração</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita por Mês</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0066cc" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuários Ativos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#4ECDC4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela de Tenants */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Tenants Cadastrados</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome da Loja</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Plano</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data Criação</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: tenant.theme_color }} />
                        <div>
                          <p className="font-semibold text-gray-900">{tenant.name}</p>
                          <p className="text-xs text-gray-500">{tenant.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tenant.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          tenant.subscription_tier === 'enterprise'
                            ? 'bg-purple-100 text-purple-800'
                            : tenant.subscription_tier === 'pro'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {tenant.subscription_tier.charAt(0).toUpperCase() + tenant.subscription_tier.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          tenant.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : tenant.status === 'trial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tenant.status === 'active' ? 'Ativo' : tenant.status === 'trial' ? 'Trial' : 'Suspenso'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(tenant.created_at).toLocaleDateString('pt-BR')}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => router.push(`/${tenant.slug}/admin`)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Acessar
                      </button>
                      <button
                        onClick={() => handleSuspendTenant(tenant.id)}
                        className={`font-semibold ${
                          tenant.status === 'active'
                            ? 'text-red-600 hover:text-red-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {tenant.status === 'active' ? 'Suspender' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
