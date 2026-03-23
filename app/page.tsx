'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Store, Users, TrendingUp, Lock, Zap, Globe } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: Store,
      title: 'Crie sua Loja',
      description: 'Configure sua loja online em minutos com produtos, descrições e imagens.',
    },
    {
      icon: Users,
      title: 'Gerencie Clientes',
      description: 'Acompanhe seus clientes, pedidos e vendas em tempo real.',
    },
    {
      icon: TrendingUp,
      title: 'Aumente Vendas',
      description: 'Dashboards e analytics para otimizar seu negócio.',
    },
    {
      icon: Lock,
      title: 'Dados Seguros',
      description: 'Isolamento completo de dados entre tenants com criptografia.',
    },
    {
      icon: Zap,
      title: 'Super Rápido',
      description: 'Performance otimizada para melhor experiência do cliente.',
    },
    {
      icon: Globe,
      title: 'Escalável',
      description: 'Cresce com você, de 1 a milhões de transações.',
    },
  ];

  const roles = [
    {
      role: 'Super Admin',
      access: 'Super Admin Dashboard',
      description: 'Gerenciar todas as lojas e tenants da plataforma',
      link: '/super-admin',
      color: 'bg-red-50 border-red-200',
      buttonColor: 'bg-red-600 hover:bg-red-700',
    },
    {
      role: 'Loja Proprietário',
      access: 'Tenant Admin Panel',
      description: 'Gerenciar seus produtos, vendas e configurações da loja',
      link: '/example-store/admin',
      color: 'bg-blue-50 border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      role: 'Cliente',
      access: 'Storefront Público',
      description: 'Visualizar produtos e realizar compras',
      link: '/example-store',
      color: 'bg-green-50 border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Registre-se',
      description: 'Crie sua conta e loja em segundos',
    },
    {
      number: '2',
      title: 'Configure sua Loja',
      description: 'Adicione produtos e personalize o visual',
    },
    {
      number: '3',
      title: 'Comece a Vender',
      description: 'Receba pedidos e gerencie vendas',
    },
    {
      number: '4',
      title: 'Cresça seu Negócio',
      description: 'Escale com analytics e insights',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Store className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">Spree SaaS</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              Entrar
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Criar Loja
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-6 text-balance">
          Plataforma Multi-Tenant de eCommerce
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto text-balance">
          Crie e gerencie múltiplas lojas online em uma única plataforma. Comece gratuitamente e escale conforme seu negócio cresce.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
          >
            Começar Agora <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push('/super-admin')}
            className="px-8 py-3 border-2 border-slate-300 text-slate-900 rounded-lg hover:border-slate-400 font-semibold"
          >
            Ver Demo Admin
          </button>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-4 text-center">Como Funciona</h2>
        <p className="text-lg text-slate-600 mb-12 text-center max-w-2xl mx-auto">
          Três níveis de acesso para diferentes usuários
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((item, index) => (
            <div
              key={index}
              className={`border-2 rounded-xl p-8 ${item.color}`}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.role}</h3>
              <p className="text-sm font-semibold text-blue-600 mb-3">{item.access}</p>
              <p className="text-slate-700 mb-6">{item.description}</p>
              <button
                onClick={() => router.push(item.link)}
                className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${item.buttonColor} transition`}
              >
                Acessar
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Passos para Começar */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-slate-50 rounded-2xl my-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Comece em 4 Passos</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Recursos Poderosos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition">
                <Icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-4 py-20 bg-blue-600 rounded-2xl text-center my-12">
        <h2 className="text-4xl font-bold text-white mb-4 text-balance">Pronto para Começar?</h2>
        <p className="text-xl text-blue-100 mb-8 text-balance">
          Crie sua loja online agora mesmo. Sem cartão de crédito necessário.
        </p>
        <button
          onClick={() => router.push('/register')}
          className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold flex items-center gap-2 mx-auto"
        >
          Registrar Grátis <ArrowRight className="w-5 h-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-600">
          <p>© 2026 Spree Commerce SaaS. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
