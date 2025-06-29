import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = [
    '/',
    '/auth',
    '/about',
    '/techniques',
    '/dashboard',
  ];

  const isPublicPath = publicPaths.some(publicPath => {
    if (publicPath === '/') {
      return path === '/';
    }
    return path.startsWith(publicPath + '/') || path === publicPath;
  });

  const tokenCookie = request.cookies.get('accessToken')?.value;

  console.log(`Middleware Check (QUICK FIX): Path=${path}, IsPublic=${isPublicPath}, HasTokenCookie=${!!tokenCookie}`);

  /*
  if (!isPublicPath && !tokenCookie) {
    console.log(`Middleware: Access denied to "${path}" (protected route, no auth cookie). Redirecting to /auth.`);
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }
  */

  if (tokenCookie && path === '/auth') {
    console.log(`Middleware: Logged-in user (has auth cookie) accessing /auth. Redirecting to /.`);
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  console.log(`Middleware (QUICK FIX): Allowing access to "${path}". Protection relies on client/API.`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};