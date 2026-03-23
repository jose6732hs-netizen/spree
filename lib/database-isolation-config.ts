// Configuração de isolamento de dados no nível do banco
// Este arquivo deve ser usado como referência para configurar RLS no PostgreSQL

/**
 * SQL Script para configurar Row-Level Security (RLS) no PostgreSQL
 * Execute este script no seu banco de dados para ativar isolamento automático
 */

export const RLS_SETUP_SQL = `
-- Criar tabela de tenants
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  theme_color VARCHAR(7) DEFAULT '#0066cc',
  status VARCHAR(50) DEFAULT 'active',
  subscription_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de usuários com tenant_id
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  tenant_id UUID REFERENCES tenants(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de produtos com tenant_id
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sku VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'active',
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de pedidos com tenant_id
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  customer_id UUID NOT NULL REFERENCES users(id),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ativar RLS (Row-Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Criar policy para produtos: cada tenant vê apenas seus produtos
CREATE POLICY products_tenant_isolation ON products
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Criar policy para pedidos: cada tenant vê apenas seus pedidos
CREATE POLICY orders_tenant_isolation ON orders
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Criar policy para usuários: cada tenant vê apenas seus usuários
CREATE POLICY users_tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid OR role = 'super_admin');

-- Criar índices para performance
CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_sku ON products(sku);
`

/**
 * Exemplo de como usar RLS em uma query
 */
export const RLS_USAGE_EXAMPLE = `
-- Antes de fazer qualquer query, definir o tenant atual
SET app.current_tenant_id = 'tenant-uuid-aqui';

-- Agora qualquer SELECT/UPDATE/DELETE será automaticamente filtrado pelo tenant
SELECT * FROM products;  -- Retorna apenas produtos deste tenant
SELECT * FROM orders;    -- Retorna apenas pedidos deste tenant
`

/**
 * Integração com banco de dados (exemplo usando pg library)
 */
export const DATABASE_INTEGRATION_EXAMPLE = `
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function executeWithTenantContext(
  tenantId: string,
  query: string,
  params: any[] = []
) {
  const client = await pool.connect();
  try {
    // Definir o tenant context
    await client.query(\`SET app.current_tenant_id = \$1\`, [tenantId]);
    
    // Executar a query (será automaticamente filtrada por tenant)
    const result = await client.query(query, params);
    
    return result.rows;
  } finally {
    client.release();
  }
}

// Uso:
// const products = await executeWithTenantContext(tenantId, 'SELECT * FROM products');
`
