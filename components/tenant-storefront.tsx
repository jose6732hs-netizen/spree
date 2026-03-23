'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Product } from '@/lib/types'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'

interface CartItem extends Product {
  quantity: number
}

export function TenantStorefront() {
  const params = useParams()
  const tenantSlug = params.tenant as string
  const { tenant } = useAuth()

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      tenant_id: tenantSlug,
      name: 'Camiseta Premium Azul',
      description: 'Camiseta 100% algodão de alta qualidade com design exclusivo',
      price: 79.99,
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      sku: 'SHIRT-001',
      status: 'active',
      created_at: '2024-01-15',
      updated_at: '2024-03-20',
    },
    {
      id: '2',
      tenant_id: tenantSlug,
      name: 'Calça Jeans Preta',
      description: 'Calça jeans clássica com ajuste confortável',
      price: 149.99,
      image_url: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop',
      sku: 'JEANS-001',
      status: 'active',
      created_at: '2024-02-10',
      updated_at: '2024-03-18',
    },
    {
      id: '3',
      tenant_id: tenantSlug,
      name: 'Tênis Esportivo',
      description: 'Tênis confortável para uso diário e esportes',
      price: 249.99,
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      sku: 'SHOE-001',
      status: 'active',
      created_at: '2024-01-20',
      updated_at: '2024-03-19',
    },
    {
      id: '4',
      tenant_id: tenantSlug,
      name: 'Jaqueta Bomber',
      description: 'Jaqueta estilosa para qualquer ocasião',
      price: 299.99,
      image_url: 'https://images.unsplash.com/photo-1552062407-291826716aeb?w=400&h=400&fit=crop',
      sku: 'JACKET-001',
      status: 'active',
      created_at: '2024-03-01',
      updated_at: '2024-03-22',
    },
  ])

  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  const themeColor = tenant?.theme_color || '#0066cc'

  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const handleToggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId))
    } else {
      setFavorites([...favorites, productId])
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50" style={{ '--brand-color': themeColor } as any}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: themeColor }}>
              {tenant?.name || 'Minha Loja'}
            </h1>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-2 text-gray-700 hover:text-gray-900 transition"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span
                className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                style={{ backgroundColor: themeColor }}
              >
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {showCart ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Seu Carrinho</h2>

              {cart.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="px-6 py-2 rounded-lg text-white transition font-semibold"
                    style={{ backgroundColor: themeColor }}
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow p-6 flex items-center gap-6">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                        <p className="font-semibold text-gray-900 mt-2">R$ {item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100">-</button>
                          <span className="px-4 py-2">{item.quantity}</span>
                          <button className="px-3 py-2 text-gray-600 hover:bg-gray-100">+</button>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h3>

                  <div className="space-y-3 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>R$ {cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Frete</span>
                      <span>R$ 0,00</span>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold text-lg text-gray-900 my-6">
                    <span>Total</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                  </div>

                  <button
                    className="w-full py-3 rounded-lg text-white transition font-semibold"
                    style={{ backgroundColor: themeColor }}
                  >
                    Ir para Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Nossos Produtos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden">
                  <div className="relative bg-gray-200 h-48 flex items-center justify-center">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      onClick={() => handleToggleFavorite(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100 transition"
                    >
                      <Heart
                        className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                    <div className="flex justify-between items-center">
                      <p className="font-bold text-lg text-gray-900">R$ {product.price.toFixed(2)}</p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-4 py-2 rounded-lg text-white transition font-semibold text-sm"
                        style={{ backgroundColor: themeColor }}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Sobre {tenant?.name || 'Nossa Loja'}</h4>
              <p className="text-gray-400 text-sm">Oferecemos produtos de qualidade com os melhores preços do mercado.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
                <li><a href="#" className="hover:text-white transition">Políticas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Devoluções</a></li>
                <li><a href="#" className="hover:text-white transition">Rastreamento</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 {tenant?.name || 'Minha Loja'}. Todos os direitos reservados. Powered by Spree Commerce.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
