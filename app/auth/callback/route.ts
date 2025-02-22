import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Rate limit handling for auth callback
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRIES = 3;

async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (
      retries > 0 &&
      error?.message?.includes('Request rate limit reached')
    ) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      
      // Exchange the code for a session with retry logic
      const { error } = await withRetry(async () => {
        return await supabase.auth.exchangeCodeForSession(code);
      });
      
      if (error) {
        console.error('Auth callback error:', error);
        // If it's a rate limit error that persisted after retries, add a more helpful message
        const errorMessage = error.message.includes('Request rate limit reached')
          ? 'Too many sign-in attempts. Please wait a few minutes and try again.'
          : error.message;
        return NextResponse.redirect(
          new URL(`/auth?error=${encodeURIComponent(errorMessage)}`, requestUrl.origin)
        );
      }
    }

    // Redirect to the dashboard on successful authentication
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
  } catch (error: any) {
    console.error('Auth callback error:', error);
    const errorMessage = error?.message?.includes('Request rate limit reached')
      ? 'Too many sign-in attempts. Please wait a few minutes and try again.'
      : 'Authentication failed';
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
} 