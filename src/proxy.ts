import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

const publicPaths = ['/', '/login', '/register']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const cookie = request.cookies.get('session')?.value
  const session = cookie ? await decrypt(cookie) : null
  const isLoggedIn = !!session?.userId

  const isPublic = publicPaths.some((p) => path === p || path.startsWith(p + '/'))

  if (isPublic) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = session.role

  if (path.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (path.startsWith('/trainer') && role !== 'TRAINER') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (path.startsWith('/client') && role !== 'CLIENT') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
