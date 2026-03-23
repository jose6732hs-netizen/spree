'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter, useParams } from 'next/navigation'
import { Product } from '@/lib/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function TenantAdminPanel() {
  const { isAuthenticated, isAdmin, logout, tenant } = useAuth()
  const router = useRouter()
  const params = useParams()
  const tenantSlug = params.tenant as string

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      tenant_id: tenantSlug,
      name: 'Produto Premium A',
      description: 'Descrição do produto',
      price: 299.99,
      sku: 'PROD-001',
      status: 'active',
      created_at: '2024-01-15',
      updated_at: '2024-03-20',
    },
    {
      id: '2',
      tenant_id: tenantSlug,
      name: 'Produto Premium B',
      description: 'Descrição do produto',
      price: 149.99,
      sku: 'PROD-002',
      status: 'active',
      created_at: '2024-02-10',
      updated_at: '2024-03-18',
    },
  ])

  const [showNewProduct, setShowNewProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
  })

  const chartData = [
    { day: 'Seg', sales: 240, revenue: 4000 },
    { day: 'Ter', sales: 320, revenue: 6000 },
    { day: 'Qua', sales: 180, revenue: 3200 },
    { day: 'Qui', sales: 390, revenue: 8000 },
    { day: 'Sex', sales: 450, revenue: 9000 },
    { day: 'Sab', sales: 520, revenue: 10500 },
    { day: 'Dom', sales: 380, revenue: 7200 },
  ]

  const [metrics, setMetrics] = useState({
    totalProducts: products.length,
    totalOrders: 342,
    totalRevenue: 45800,
    conversionRate: 3.2,
  })

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/login')
    }
  }, [isAuthenticated, isAdmin, router])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) return

    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      tenant_id: tenantSlug,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      sku: newProduct.sku,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setProducts([...products, product])
    setNewProduct({ name: '', description: '', price: '', sku: '' })
    setShowNewProduct(false)
    setMetrics({ ...metrics, totalProducts: metrics.totalProducts + 1 })
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
    setMetrics({ ...metrics, totalProducts: metrics.totalProducts - 1 })
  }

  if (!isAuthenticated || !isAdmin) {
    return <div className="text-center py-12">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel da Loja</h1>
            <p className="text-gray-600">{tenant?.name || 'Sua Loja'}</p>
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
            <p className="text-gray-600 text-sm font-semibold">Total de Produtos</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.totalProducts}</p>
            <p className="text-green-600 text-xs mt-2">+2 produtos este mês</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-semibold">Total de Pedidos</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.totalOrders}</p>
            <p className="text-green-600 text-xs mt-2">+8% vs mês anterior</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
            <p className="text-gray-600 text-sm font-semibold">Receita Total</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">R$ {metrics.totalRevenue.toLocaleString('pt-BR')}</p>
            <p className="text-green-600 text-xs mt-2">+15% vs mês anterior</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm font-semibold">Taxa de Conversão</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{metrics.conversionRate}%</p>
            <p className="text-green-600 text-xs mt-2">Aceleração</p>
          </div>
        </div>

        {/* Gráfico de Vendas */}
        <div className="bg-white rounded-lg shadow p-6 mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas Semanais</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#0066cc" name="Receita (R$)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Produtos */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Meus Produtos</h3>
            <button
              onClick={() => setShowNewProduct(!showNewProduct)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
            >
              {showNewProduct ? 'Cancelar' : 'Adicionar Produto'}
            </button>
          </div>

          {showNewProduct && (
            <div className="border-b border-gray-200 p-6 bg-gray-50">
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Produto</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Camiseta Premium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">SKU</label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: PROD-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrição do produto"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Criar Produto
                </button>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preço</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data Criação</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.description}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">R$ {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(product.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-semibold">Editar</button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Deletar
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
