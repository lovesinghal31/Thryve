import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic middleware to protect /dashboard routes using a client-set accessToken cookie.
// NOTE: This is a stop‑gap; replace with an httpOnly secure cookie issued by the backend.
export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  const { pathname } = req.nextUrl;

  // Protect dashboard namespace.
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('next', pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent visiting login when already authenticated.
  if (pathname === '/login' && token) {
    const dashUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
