import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ── Protected: /appointment, /dashboard → must be logged in ─
  if (pathname.startsWith('/appointment') || pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Protected: /admin → must be admin role ────────────────────
  if (pathname.startsWith('/admin')) {
    // Allow the login page for admin (handled by admin layout)
    // If using NextAuth token, check role
    if (token && token.role !== 'admin') {
      // Patient trying to access admin → redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // ── Redirect already-logged-in users away from auth pages ────
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      if (token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/appointment', '/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
