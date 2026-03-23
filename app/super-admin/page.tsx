import { SuperAdminDashboard } from '@/components/super-admin-dashboard'

export const metadata = {
  title: 'Super Admin Dashboard - Spree Commerce SaaS',
  description: 'Gerenciar tenants e métricas globais da plataforma',
}

export default function SuperAdminPage() {
  return <SuperAdminDashboard />
}
