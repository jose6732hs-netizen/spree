'use client';

import { useState } from 'react';
import Header from '@/components/header';
import ProductGrid from '@/components/product-grid';
import Cart from '@/components/cart';

export default function Home() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const products = [
    {
      id: 1,
      name: 'Fone de Ouvido Premium',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      description: 'Som cristalino com cancelamento de ruído',
    },
    {
      id: 2,
      name: 'Smartwatch Moderno',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      description: 'Tecnologia wearable de ponta',
    },
    {
      id: 3,
      name: 'Câmera Profissional',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1606933248051-5ce98a1fb30e?w=500&h=500&fit=crop',
      description: 'Capture momentos em 4K',
    },
    {
      id: 4,
      name: 'Teclado Mecânico',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1587829191301-4b171efb9dbd?w=500&h=500&fit=crop',
      description: 'Digitação precisa e rápida',
    },
    {
      id: 5,
      name: 'Monitor 4K',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop',
      description: 'Experiência visual extraordinária',
    },
    {
      id: 6,
      name: 'Mouse Sem Fio',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
      description: 'Preciso e ergonômico',
    },
  ];

  const handleAddToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={cartItems.length} onCartClick={() => setShowCart(!showCart)} />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">Bem-vindo à Nossa Loja</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Descubra produtos eletrônicos de qualidade com preços incríveis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <ProductGrid products={products} onAddToCart={handleAddToCart} />
          </div>

          {showCart && (
            <div className="lg:col-span-1">
              <Cart items={cartItems} onRemove={handleRemoveFromCart} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
