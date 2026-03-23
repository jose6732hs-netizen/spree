// Tipos para o sistema multi-tenant SaaS
export type UserRole = 'super_admin' | 'tenant_admin' | 'customer' | 'staff'

export interface Tenant {
  id: string
  name: string
  slug: string
  email: string
  logo_url?: string
  theme_color: string
  status: 'active' | 'suspended' | 'trial'
  subscription_tier: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tenant_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthSession {
  user: User
  tenant: Tenant | null
  token: string
  expires_at: string
}

export interface Product {
  id: string
  tenant_id: string
  name: string
  description: string
  price: number
  image_url?: string
  sku: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  tenant_id: string
  customer_id: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}
