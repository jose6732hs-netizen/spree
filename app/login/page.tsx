import { LoginForm } from '@/components/login-form'

export const metadata = {
  title: 'Login - Spree Commerce SaaS',
  description: 'Entre na sua loja Spree Commerce',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
