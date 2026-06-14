import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'odu_admin_auth';
const SESSION_SECONDS = 60 * 30; // 30-minute inactivity timeout

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through login page and all API routes
  if (pathname.startsWith('/login') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(ADMIN_COOKIE);
  const expected = process.env.ADMIN_PASSWORD;

  if (!cookie || !expected || cookie.value !== expected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Slide the session window on every authenticated page request
  const response = NextResponse.next();
  response.cookies.set(ADMIN_COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
