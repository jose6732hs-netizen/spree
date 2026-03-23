import { RegisterForm } from '@/components/register-form'

export const metadata = {
  title: 'Criar Loja - Spree Commerce SaaS',
  description: 'Crie sua própria loja online com Spree Commerce',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  )
}
