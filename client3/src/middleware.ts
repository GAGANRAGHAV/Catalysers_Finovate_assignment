import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface CustomJwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Add paths that don't require authentication
const publicPaths = ['/loginsignup', '/', '/front']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  const path = request.nextUrl.pathname

  // Allow access to public paths
  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/front', request.url))
  }

  try {
    // Decode and verify token
    const decoded = jwtDecode<CustomJwtPayload>(token)

    // Role-based route protection
    if (path.startsWith('/admin') && decoded.role !== 'Admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (path.startsWith('/manager') && decoded.role !== 'Manager') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (path.startsWith('/user') && decoded.role !== 'User') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/front', request.url))
  }
}

// Configure which paths should be protected
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