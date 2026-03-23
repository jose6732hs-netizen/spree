import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Verificar se a sessão existe nos cookies
  const session = request.cookies.get('auth_session')?.value

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/register', '/']

  // Rotas super admin (apenas para super_admin)
  const superAdminRoutes = ['/super-admin']

  // Rotas tenant admin (apenas para tenant_admin)
  const adminRoutes = ['/admin']

  // Se tentar acessar super-admin ou admin sem autenticação
  if ((superAdminRoutes.some((route) => pathname.startsWith(route)) || adminRoutes.some((route) => pathname.startsWith(route))) && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
