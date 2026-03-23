# Fluxo de Usuários - Spree Commerce SaaS Multi-Tenant

## 1. Página Inicial (Pública)

**URL:** `http://localhost:3000/`

Todos os usuários começam aqui. A página mostra:
- Explicação do que é a plataforma
- Como funciona (3 níveis de acesso)
- Recursos principais
- Botões de ação para **Entrar** ou **Criar Loja**

---

## 2. Registro de Nova Loja

**URL:** `http://localhost:3000/register`

### Como funciona:

1. **Novo empresário clica em "Criar Loja"** na página inicial
2. **Preenche o formulário:**
   - Nome da Loja: "Tech Store"
   - Email: `seu@email.com`
   - Senha: `senha123`
   - Confirmar Senha

3. **O sistema:**
   - Cria a loja com slug `tech-store`
   - Cria conta de admin (`seu@email.com`)
   - Redireciona para: `http://localhost:3000/tech-store/admin`

### Resultado:
- Nova loja criada
- Usuário já logado como Tenant Admin

---

## 3. Login de Usuário Existente

**URL:** `http://localhost:3000/login`

### Para Tenant Admin (Proprietário de Loja):

1. **Preenche:**
   - Email: `seu@email.com`
   - Senha: `senha123`
   - Slug da Loja: `tech-store`

2. **Redireciona para:**
   - `http://localhost:3000/tech-store/admin`

### Para Super Admin:

1. **Preenche:**
   - Email: `super@admin.com`
   - Senha: `password123`
   - Slug da Loja: **(deixa em branco)**

2. **Redireciona para:**
   - `http://localhost:3000/super-admin`

---

## 4. Super Admin Dashboard

**URL:** `http://localhost:3000/super-admin`

**Quem acessa:** Super Admin da plataforma

### O que vê:

- **Métricas globais:**
  - Total de tenants/lojas ativas
  - Receita total
  - Clientes totais
  - Taxa de crescimento

- **Gráficos:**
  - Receita mensal (gráfico de linha)
  - Usuários ativos (gráfico de barras)

- **Tabela de Tenants:**
  - Nome da loja
  - Email do proprietário
  - Status (Ativo/Suspenso)
  - Plano (Starter/Pro/Enterprise)
  - Data de criação
  - Ações: Editar, Suspender/Ativar, Excluir

### Permissões:
- Gerenciar todas as lojas
- Ver métricas de toda plataforma
- Suspender/ativar lojas
- Gerenciar planos de cobrança

---

## 5. Tenant Admin Panel

**URL:** `http://localhost:3000/[tenant-slug]/admin`

Exemplo: `http://localhost:3000/tech-store/admin`

**Quem acessa:** Proprietário/Admin da loja

### O que vê:

- **Métricas da Loja:**
  - Total de vendas
  - Receita no mês
  - Número de pedidos
  - Produtos em estoque

- **Gráficos:**
  - Vendas semanais (gráfico de linha)
  - Produtos mais vendidos

- **Tabela de Produtos:**
  - Nome, preço, estoque
  - Ações: Editar, Deletar

- **Formulário Adicionar Produto:**
  - Nome do produto
  - Preço
  - Descrição
  - Imagem
  - Estoque

### Permissões:
- Gerenciar apenas SUA loja
- Adicionar/editar/deletar produtos
- Ver pedidos de SUA loja
- Ver analytics de SUA loja
- Não pode acessar lojas de outros tenants

---

## 6. Storefront Público (Loja Online)

**URL:** `http://localhost:3000/[tenant-slug]`

Exemplo: `http://localhost:3000/tech-store`

**Quem acessa:** Clientes/Visitantes (Público)

### O que vê:

- **Header:**
  - Logo e nome da loja (customizado por tenant)
  - Carrinho de compras
  - Quantidade de itens

- **Catálogo de Produtos:**
  - Grade de produtos
  - Nome, preço, descrição
  - Imagem do produto
  - Botão "Adicionar ao Carrinho"
  - Botão "Favoritar"

- **Carrinho Lateral:**
  - Produtos adicionados
  - Preço unitário
  - Subtotal
  - Botão "Remover item"

- **Cores Temáticas:**
  - Cada loja pode ter cores diferentes
  - Customização por tenant

### Permissões:
- Ver apenas produtos de ESSA loja
- Adicionar ao carrinho
- Marcar como favoritos
- Não pode acessar dados de outras lojas

---

## Fluxo Completo - Exemplo Prático

### Passo 1: Novo Entrepreneur
```
→ Acessa http://localhost:3000/
→ Clica "Criar Loja"
→ Preenche: Nome="Tech Store", Email="ana@techstore.com", Senha
→ Sistema cria loja "tech-store"
→ Redireciona para /tech-store/admin
```

### Passo 2: Admin Gerencia Loja
```
→ Está em /tech-store/admin (Tenant Admin Panel)
→ Adiciona 5 produtos com fotos e preços
→ Vê gráficos de vendas
→ Gerencia pedidos
```

### Passo 3: Cliente Compra
```
→ Acessa http://localhost:3000/tech-store (Storefront)
→ Vê produtos da Tech Store
→ Adiciona 2 produtos ao carrinho
→ Vê total: R$ 599,98
→ Clica "Finalizar Compra" (integração Stripe futura)
```

### Passo 4: Super Admin Monitora
```
→ Acessa /super-admin
→ Vê que tech-store tem 3 vendas hoje
→ Vê receita total da plataforma
→ Pode suspender/ativar qualquer loja
```

---

## Isolamento de Dados - Como Funciona

### Tenant A (loja-a.com)
- Vê apenas seus produtos
- Vê apenas seus pedidos
- Vê apenas seus clientes
- **Não consegue acessar dados da Tenant B**

### Tenant B (loja-b.com)
- Vê apenas seus produtos
- Vê apenas seus pedidos
- Vê apenas seus clientes
- **Não consegue acessar dados da Tenant A**

### Implementação Técnica:

1. **Middleware:** Detecta tenant pela URL
   ```
   /tech-store/admin → tenant_id = "tech-store"
   /gamer-shop/admin → tenant_id = "gamer-shop"
   ```

2. **Filtragem de Dados:** Antes de retornar dados:
   ```javascript
   // Em produção, seria em SQL
   const productsForTenant = allProducts.filter(p => p.tenant_id === currentTenant)
   ```

3. **Proteção de Rotas:** Tenant B não pode acessar:
   - `/tech-store/admin` (tenant diferente)
   - `/tech-store` (tenant diferente)
   - `/api/tech-store/products` (tenant diferente)

---

## Páginas do Sistema

| Página | URL | Público? | Requer Login? | Nota |
|--------|-----|----------|---------------|------|
| Home | `/` | Sim | Não | Landing page |
| Registro | `/register` | Sim | Não | Criar nova loja |
| Login | `/login` | Sim | Não | Entrar no sistema |
| Super Admin | `/super-admin` | Não | Sim (Super Admin) | Dashboard global |
| Tenant Admin | `/:tenant/admin` | Não | Sim (Tenant Admin) | Painel do proprietário |
| Storefront | `/:tenant` | Sim | Não | Loja pública |

---

## Segurança & Boas Práticas

1. **Isolamento de Dados:**
   - Cada tenant vê apenas seus dados
   - Middleware valida acesso
   - Filtros aplicados em tempo de execução

2. **Autenticação:**
   - SessionStorage armazena user role
   - Middleware verifica permissões
   - Em produção: JWT + cookies HTTP-only

3. **Autorização:**
   - Super Admin: Acesso total
   - Tenant Admin: Acesso apenas sua loja
   - Customer: Acesso apenas loja pública

4. **Escalabilidade:**
   - Suporta N lojas
   - Cada loja independente
   - Fácil adicionar novos tenants

---

## Próximas Implementações

1. **Pagamentos (Stripe)**
   - Integrar Stripe no checkout
   - Comissão automática para plataforma

2. **Email Transacional**
   - Confirmação de pedido
   - Notificação de novo produto
   - Reset de senha

3. **Analytics Avançado**
   - Comportamento de clientes
   - Produtos mais visualizados
   - Taxa de conversão

4. **Banco de Dados Real**
   - PostgreSQL com RLS
   - Backup automático
   - Replicação

5. **API REST**
   - Autenticação JWT
   - Rate limiting
   - Webhooks

6. **Mobile App**
   - Admin app nativa
   - App de vendas
