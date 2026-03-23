# Spree Commerce - SaaS Multi-Tenant

Uma plataforma de eCommerce moderna, escalável e multi-tenant construída com Next.js, TypeScript e um sistema robusto de isolamento de dados.

## Features

- **Multi-Tenant**: Cada cliente tem sua própria loja isolada e independente
- **Super Admin Dashboard**: Gerenciamento central de todos os tenants
- **Tenant Admin Panel**: Painel para cada loja gerenciar produtos e pedidos
- **Storefront Customizável**: Cada tenant pode personalizar cores e branding
- **Autenticação Multi-Nível**: Super Admin, Tenant Admin e Customer
- **Row-Level Security**: Isolamento automático de dados no banco
- **Carrinho de Compras**: Sistema funcional de compras por tenant
- **Gráficos e Análises**: Dashboards com métricas de vendas
- **Responsivo**: Design mobile-first para todas as lojas

## Estrutura do Projeto

```
.
├── app/                      # Rotas Next.js
│   ├── (auth)/              # Rotas públicas (login, register)
│   ├── [tenant]/            # Rotas dinâmicas de tenant
│   │   ├── page.tsx         # Storefront público
│   │   └── admin/           # Admin panel do tenant
│   ├── super-admin/         # Super admin dashboard
│   └── layout.tsx           # Layout root
├── components/              # Componentes React reutilizáveis
│   ├── login-form.tsx
│   ├── register-form.tsx
│   ├── super-admin-dashboard.tsx
│   ├── tenant-admin-panel.tsx
│   └── tenant-storefront.tsx
├── lib/                     # Utilitários e contextos
│   ├── types.ts            # Tipos TypeScript compartilhados
│   ├── auth-context.tsx    # Contexto de autenticação
│   ├── tenant-isolation.ts # Utilitários de isolamento
│   └── database-isolation-config.ts # Configuração RLS
├── middleware.ts            # Middleware Next.js para proteção de rotas
├── tailwind.config.ts       # Configuração Tailwind CSS
├── next.config.js           # Configuração Next.js
├── .env.local              # Variáveis de ambiente (local)
├── .env.production         # Variáveis de ambiente (produção)
└── DEPLOYMENT.md           # Guia de deployment
```

## Começar Rápido

### Desenvolvimento Local

#### Pré-requisitos
- Node.js 18+
- pnpm (ou npm/yarn)
- Docker Desktop (para banco de dados)

#### Setup

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/spree-saas.git
cd spree-saas
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Inicie os serviços Docker** (PostgreSQL, Redis, etc)
```bash
docker-compose up -d
```

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
# Edite o arquivo conforme necessário
```

5. **Execute o servidor de desenvolvimento**
```bash
pnpm dev
```

6. **Acesse a aplicação**
- Storefront: http://localhost:3000
- Login: http://localhost:3000/login
- Registro: http://localhost:3000/register

## Fluxo de Uso

### 1. Criar uma Nova Loja (Registro)

1. Acesse http://localhost:3000/register
2. Preencha:
   - Nome da Loja: ex "Minha Loja Premium"
   - Email: seu@email.com
   - Senha: (8+ caracteres)
3. Clique em "Criar Loja"
4. Você será redirecionado para o admin panel

### 2. Acessar o Admin Panel

Como Tenant Admin:
- URL: `http://localhost:3000/minha-loja-premium/admin`
- Aqui você pode:
  - Ver métricas de vendas
  - Gerenciar produtos
  - Ver pedidos e clientes
  - Configurar a loja

Como Super Admin:
- URL: `http://localhost:3000/super-admin`
- Aqui você pode:
  - Ver todos os tenants
  - Gerenciar subscrições
  - Acessar qualquer loja
  - Ver métricas globais

### 3. Acessar a Loja (Storefront)

- URL: `http://localhost:3000/minha-loja-premium`
- Clientes podem:
  - Ver catálogo de produtos
  - Adicionar ao carrinho
  - Favoritar produtos
  - Fazer checkout

## Fluxo de Autenticação

```
Usuário → Login → AuthProvider → Armazena Session
                ↓
            Super Admin? → /super-admin (acesso global)
                ↓
            Tenant Admin? → /[tenant]/admin (acesso sua loja)
                ↓
            Customer? → /[tenant] (storefront)
```

## Isolamento de Dados

### Nível de Aplicação (Implementado)

O isolamento atual acontece em três níveis:

1. **Auth Context**: Verifica role do usuário e tenant_id
2. **Componentes**: Filtram dados por tenant_id
3. **Utilitários**: `TenantDataIsolation` fornece validação

### Nível de Banco (Recomendado para Produção)

Para maior segurança, configure Row-Level Security (RLS):

```sql
-- Ver arquivo: lib/database-isolation-config.ts
-- Contém SQL para ativar RLS automático no PostgreSQL
```

## Tipos de Usuários

### Super Admin
- Email: `admin@seudominio.com`
- Acesso: Painel global
- Permissões: Gerenciar todos os tenants, ver todas as métricas

### Tenant Admin
- Email: criado ao registrar loja
- Acesso: Admin panel da sua loja (ex: `/minha-loja/admin`)
- Permissões: Gerenciar produtos, pedidos e clientes da sua loja

### Customer
- Usuário final que compra
- Acesso: Storefront público (ex: `/minha-loja`)
- Permissões: Ver produtos, carrinho, checkout

## API Routes (A Implementar)

Exemplo de como adicionar rotas de API:

```typescript
// app/api/[tenant]/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateTenantAccess } from '@/lib/tenant-isolation'

export async function GET(
  request: NextRequest,
  { params }: { params: { tenant: string } }
) {
  try {
    // Validar acesso
    validateTenantAccess(getCurrentUser(), params.tenant)
    
    // Buscar produtos do tenant
    const products = await getProductsByTenant(params.tenant)
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 403 })
  }
}
```

## Customização por Tenant

Cada tenant pode customizar:

1. **Cor do tema**: Armazenada em `tenant.theme_color`
2. **Nome da loja**: Armazenada em `tenant.name`
3. **Logo**: Campo `logo_url` (a implementar)
4. **Domínio customizado**: (a implementar)
5. **Produtos**: Cada loja tem seus próprios produtos

## Performance e Escalabilidade

- **Caching com Redis**: Para dados frequentes
- **Índices no banco**: `tenant_id`, `email`, `sku`
- **Lazy loading**: Componentes carregam sob demanda
- **Code splitting**: Rotas são otimizadas automaticamente
- **CDN**: Imagens servidas pelo Vercel ou CloudFront

## Segurança

### Implementado
- Autenticação multi-nível com roles
- Isolamento de dados por tenant
- Middleware de proteção de rotas
- Validação de propriedade de tenant

### Recomendações para Produção
- HTTPS/SSL obrigatório
- JWT com expiração configurável
- 2FA para super admin
- Rate limiting em APIs
- Audit logs para todas as ações
- Backup automático diário

## Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Banco**: PostgreSQL com RLS (recomendado: Supabase)
- **Cache**: Redis
- **Gráficos**: Recharts
- **Auth**: Sistema customizado (evoluir para NextAuth ou Auth0)
- **Deployment**: Vercel (recomendado), PM2, Nginx

## Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL=postgresql://user:pass@localhost:5432/spree_saas

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000

# Autenticação
JWT_SECRET=sua-chave-secreta
SESSION_SECRET=sua-outra-chave-secreta

# Stripe (futura integração)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Roadmap Futuro

- [ ] Integração com Stripe para pagamentos
- [ ] Sistema de cupons e promoções
- [ ] Relatórios e analytics avançados
- [ ] Suporte a múltiplas moedas
- [ ] Integração com shipping (Correios, Sedex)
- [ ] Sistema de avaliações e comentários
- [ ] Email marketing integrado
- [ ] Mobile app (React Native)
- [ ] Webhooks para integrações
- [ ] API pública para terceiros

## Troubleshooting

### Porta 3000 já está em uso
```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 <PID>
```

### Erro de conexão com banco
```bash
# Verificar Docker
docker ps

# Reiniciar containers
docker-compose restart
```

### Sessão não persiste
```bash
# Verificar localStorage
# DevTools → Application → Local Storage
# Limpar e fazer login novamente
```

## Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

MIT - Veja LICENSE para detalhes

## Suporte

Para questões e suporte:
- Issues: GitHub Issues
- Email: suporte@seudominio.com
- Docs: Veja DEPLOYMENT.md para mais detalhes

## Agradecimentos

Construído com:
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [PostgreSQL](https://www.postgresql.org)
- [Spree Commerce](https://spreecommerce.org)

---

Feito com por [Seu Nome/Organização]
