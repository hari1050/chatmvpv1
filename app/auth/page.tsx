'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { Toaster } from 'react-hot-toast';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const supabase = createClientComponentClient();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          {isSignIn ? 'Sign in to your account' : 'Create your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-secondary py-8 px-4 shadow-lg border border-border sm:rounded-lg sm:px-10">
          {/* Email Form */}
          {isSignIn ? <SignInForm /> : <SignUpForm />}
          
          <div className="mt-6">
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="w-full text-center text-sm text-primary hover:text-primary-hover transition-colors"
            >
              {isSignIn ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 