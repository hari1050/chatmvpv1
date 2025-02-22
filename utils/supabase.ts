import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import type { SupabaseClient } from '@supabase/supabase-js';

// Rate limit handling utilities
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

// Client-side Supabase client (for components)
export const createClient = () => {
  const client = createClientComponentClient<Database>();
  
  // Wrap auth methods with retry logic
  const enhancedAuth = {
    ...client.auth,
    signInWithPassword: (credentials: any) =>
      withRetry(() => client.auth.signInWithPassword(credentials)),
    signUp: (credentials: any) =>
      withRetry(() => client.auth.signUp(credentials)),
    signInWithOAuth: (credentials: any) =>
      withRetry(() => client.auth.signInWithOAuth(credentials))
  };

  return client as SupabaseClient<Database> & {
    auth: typeof enhancedAuth;
  };
};

// Server-side Supabase client (for API routes)
export const createServerClient = () => {
  return createRouteHandlerClient<Database>({ cookies });
};

// Helper function to get the current user
export const getCurrentUser = async (client = createClient()) => {
  try {
    const { data: { user }, error } = await client.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper function to get user profile
export const getUserProfile = async (client = createClient()) => {
  try {
    const user = await getCurrentUser(client);
    if (!user) return null;

    const { data: profile, error } = await client
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Helper function to check if setup is complete
export const isSetupComplete = async (client = createClient()) => {
  try {
    const profile = await getUserProfile(client);
    return profile?.setup_completed || false;
  } catch (error) {
    console.error('Error checking setup status:', error);
    return false;
  }
};

// Helper function to get website content
export const getWebsiteContent = async (userId: string, client = createClient()) => {
  try {
    const { data: content, error } = await client
      .from('website_content')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return content;
  } catch (error) {
    console.error('Error getting website content:', error);
    return null;
  }
}; 