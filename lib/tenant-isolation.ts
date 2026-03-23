// Utilitários para isolamento de dados por tenant
import { User, Tenant } from '@/lib/types'

export class TenantDataIsolation {
  /**
   * Verifica se um usuário tem permissão para acessar dados de um tenant específico
   */
  static canAccessTenant(user: User | null, tenantId: string): boolean {
    if (!user) return false

    // Super admin pode acessar qualquer tenant
    if (user.role === 'super_admin') return true

    // Admin de tenant só pode acessar seu próprio tenant
    if (user.role === 'tenant_admin') {
      return user.tenant_id === tenantId
    }

    return false
  }

  /**
   * Filtra dados para mostrar apenas os do tenant atual
   */
  static filterByTenant<T extends { tenant_id: string }>(items: T[], tenantId: string): T[] {
    return items.filter((item) => item.tenant_id === tenantId)
  }

  /**
   * Valida se os dados pertencem ao tenant autorizado
   */
  static validateTenantOwnership(data: { tenant_id: string }, authorizedTenantId: string): boolean {
    return data.tenant_id === authorizedTenantId
  }

  /**
   * Gera um escopo de filtro para queries do banco de dados
   */
  static getTenantScope(tenantId: string): { tenant_id: string } {
    return { tenant_id: tenantId }
  }

  /**
   * Verifica se um usuário é admin (super_admin ou tenant_admin)
   */
  static isAdmin(user: User | null): boolean {
    return user?.role === 'super_admin' || user?.role === 'tenant_admin'
  }

  /**
   * Verifica se um usuário é super admin
   */
  static isSuperAdmin(user: User | null): boolean {
    return user?.role === 'super_admin'
  }

  /**
   * Verifica se um usuário é customer
   */
  static isCustomer(user: User | null): boolean {
    return user?.role === 'customer'
  }
}

/**
 * Hook para validar acesso a resources de um tenant
 * Deve ser usado em API routes e server components
 */
export function validateTenantAccess(user: User | null, tenantId: string): boolean {
  if (!user) throw new Error('Usuário não autenticado')
  if (!TenantDataIsolation.canAccessTenant(user, tenantId)) {
    throw new Error('Acesso negado: você não tem permissão para acessar este tenant')
  }
  return true
}

/**
 * Middleware para API routes que precisam de validação de tenant
 */
export async function validateTenantMiddleware(
  user: User | null,
  tenantId: string
): Promise<{ success: boolean; error?: string }> {
  if (!user) {
    return { success: false, error: 'Usuário não autenticado' }
  }

  if (!TenantDataIsolation.canAccessTenant(user, tenantId)) {
    return { success: false, error: 'Acesso negado: você não tem permissão para acessar este tenant' }
  }

  return { success: true }
}
