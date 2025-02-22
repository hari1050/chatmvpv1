import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Pages that don't require authentication
const publicPages = ['/', '/auth', '/test', '/auth/callback', '/privacy-policy', '/terms-of-service'];

// Pages that require authentication
const protectedPages = ['/dashboard'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const { data: { session }, error } = await supabase.auth.getSession();

  // Check if the current page is protected
  const isProtectedPage = protectedPages.some(page => req.nextUrl.pathname.startsWith(page));

  // Handle authentication redirects
  if (!session && isProtectedPage) {
    // Store the original URL to redirect back after auth
    const redirectUrl = req.nextUrl.clone();
    const loginUrl = new URL('/auth', req.url);
    loginUrl.searchParams.set('redirectTo', redirectUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is signed in and trying to access auth page, redirect to dashboard
  if (session && req.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Update matcher to include all routes that need middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}; 