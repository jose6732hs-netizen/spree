# Guia de Início Rápido - Spree SaaS Multi-Tenant

## O Que é Este Projeto?

Uma **plataforma de eCommerce multi-tenant** onde você pode criar e gerenciar múltiplas lojas online em uma única base de código. Cada loja é completamente isolada e independente.

## 3 Níveis de Acesso

### 1. Super Admin (Gerenciador da Plataforma)
- Vê todas as lojas
- Gerencia tenants
- Ve métricas globais
- **Acesse:** `/super-admin`

### 2. Tenant Admin (Proprietário de Loja)
- Gerencia apenas SUA loja
- Adiciona/edita produtos
- Ve vendas e pedidos da loja
- **Acesse:** `/:tenant/admin`

### 3. Cliente (Visitante)
- Ve produtos públicos
- Adiciona ao carrinho
- Faz compras
- **Acesse:** `/:tenant`

---

## Como Usar - Passo a Passo

### Começar a Aplicação

```bash
pnpm install
pnpm dev
```

Depois abra: `http://localhost:3000`

---

### Opção 1: Testar Como Cliente

1. Clique em **"Ver Demo Admin"** na home
   - Você vai para a loja de exemplo: `/example-store`
   - Ve produtos públicos
   - Pode adicionar ao carrinho
   - Ve o carrinho funcionar em tempo real

### Opção 2: Criar Sua Própria Loja

1. Clique em **"Criar Loja"** na home
2. Preencha:
   - Nome da Loja: `Minha Loja`
   - Email: `seu@email.com`
   - Senha: `qualquer-senha`
3. Clique em **"Criar Loja Agora"**
4. Você é redirecionado para o painel admin: `/minha-loja/admin`

### Opção 3: Acessar Super Admin

1. Clique em **"Ver Demo Admin"** > **"Super Admin Dashboard"** na home
2. Faça login:
   - Email: qualquer-coisa
   - Senha: qualquer-coisa
   - Slug da Loja: *deixe em branco*
3. Você ve: `/super-admin`

---

## URLs Importantes

| O Que Fazer | URL | Exemplo |
|-------------|-----|---------|
| Página Inicial | `/` | `http://localhost:3000` |
| Registrar Loja | `/register` | `http://localhost:3000/register` |
| Fazer Login | `/login` | `http://localhost:3000/login` |
| Ver Loja (Cliente) | `/:tenant` | `http://localhost:3000/minha-loja` |
| Gerenciar Loja | `/:tenant/admin` | `http://localhost:3000/minha-loja/admin` |
| Super Admin | `/super-admin` | `http://localhost:3000/super-admin` |

---

## Funcionalidades Disponíveis

### Página Inicial ✅
- Landing page com explicação
- 3 botões de acesso
- Recursos destacados
- Call-to-action

### Registro de Loja ✅
- Criar nova loja em segundos
- Definir nome, email e senha
- Automático slug from nome

### Login ✅
- Login para tenant admin
- Login para super admin
- Redireciona automático

### Super Admin Dashboard ✅
- Ve todas as lojas
- Gráficos de receita e usuários
- Tabela com tenants
- Pode suspender/ativar lojas

### Tenant Admin Panel ✅
- Gerenciar produtos
- Ver vendas semanais
- Adicionar novos produtos
- Métricas da loja

### Storefront Público ✅
- Lista de produtos
- Carrinho de compras
- Sistema de favoritos
- Cores customizadas por loja

---

## Isolamento de Dados (How It Works)

### Cada tenant ve apenas seus dados

```
Loja A (loja-a)
├─ Produtos de A (apenas A vê)
├─ Clientes de A (apenas A vê)
└─ Vendas de A (apenas A vê)

Loja B (loja-b)
├─ Produtos de B (apenas B vê)
├─ Clientes de B (apenas B vê)
└─ Vendas de B (apenas B vê)
```

### Proteção

- Middleware detecta tenant pela URL
- Filtros aplicados em todas as queries
- Tenant B não consegue acessar `/loja-a/admin`

---

## Estrutura do Projeto

```
/vercel/share/v0-project/
├── app/
│   ├── page.tsx                 # Home
│   ├── login/page.tsx           # Login
│   ├── register/page.tsx        # Registro
│   ├── super-admin/page.tsx     # Super Admin
│   ├── [tenant]/
│   │   ├── page.tsx             # Storefront público
│   │   └── admin/page.tsx       # Admin do tenant
│   └── layout.tsx
├── components/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   ├── super-admin-dashboard.tsx
│   ├── tenant-admin-panel.tsx
│   ├── tenant-storefront.tsx
│   └── ...outros
├── lib/
│   ├── types.ts                 # Tipos TypeScript
│   ├── auth-context.tsx         # Contexto de auth (opcional em demo)
│   ├── tenant-isolation.ts      # Isolamento de dados
│   └── database-isolation-config.ts
├── middleware.ts                # Proteção de rotas
├── FLUXO_USUARIOS.md           # Este arquivo
└── GETTING_STARTED.md          # Guia rápido

```

---

## Demo: Teste Tudo

### Teste 1: Criar Loja
1. Home > "Criar Loja"
2. Nome: "Test Store"
3. Email: "test@example.com"
4. Senha: "123456"
5. Clique "Criar Loja Agora"
6. Você ve `/test-store/admin`

### Teste 2: Adicionar Produto
1. No admin, preencha:
   - Nome: "iPhone 15"
   - Preço: 4999
   - Descrição: "Último modelo"
2. Clique "Adicionar Produto"
3. Vê na tabela

### Teste 3: Ver Loja Pública
1. Acesse `/test-store` (sem `/admin`)
2. Ve os produtos
3. Adicione ao carrinho
4. Ve o carrinho atualizar em tempo real

### Teste 4: Super Admin
1. Login > deixe Loja em branco
2. Ve `/super-admin`
3. Ve todas as lojas criadas
4. Ve gráficos

---

## Próximas Funcionalidades (Roadmap)

- [ ] Banco de dados (PostgreSQL)
- [ ] Autenticação real (JWT)
- [ ] Checkout com Stripe
- [ ] Email transacional
- [ ] Analytics avançado
- [ ] API REST
- [ ] Mobile app
- [ ] Multi-idioma
- [ ] Suporte

---

## Problemas Comuns

### "Preview não abre"
- Certifique-se de ter rodado `pnpm install`
- Rode `pnpm dev`
- Aguarde mensagem "Local: http://localhost:3000"

### "Página branca"
- Abra DevTools (F12)
- Veja o console para erros
- Tente recarregar (Ctrl+R)

### "Componentes não aparecem"
- Limpe cache: `pnpm clean`
- Rode novamente: `pnpm install && pnpm dev`

---

## Documentação Completa

Para mais detalhes:
- **FLUXO_USUARIOS.md** - Fluxo completo de todos os usuários
- **ARCHITECTURE.md** - Arquitetura técnica
- **DEPLOYMENT.md** - Como fazer deploy

---

## Perguntas?

Leia a documentação acima ou inspecione o código:
- React Server Components em `/app`
- Componentes em `/components`
- Tipos em `/lib/types.ts`
- Isolamento em `/lib/tenant-isolation.ts`

Divirta-se construindo! 🚀
