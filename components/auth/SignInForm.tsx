'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import GoogleSignInButton from './GoogleSignInButton';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Countdown timer for cooldown
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if in cooldown
    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown} seconds before trying again`);
      return;
    }

    setLoading(true);

    try {
      // Validate input
      const input = signInSchema.parse({ email, password });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        if (error.message.includes('rate limit')) {
          // Set a 30-second cooldown on rate limit
          setCooldown(30);
          toast.error('Too many sign-in attempts. Please wait 30 seconds before trying again.');
        } else if (error.message === 'Invalid login credentials') {
          toast.error('Invalid email or password');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (!data?.user?.email_confirmed_at) {
        toast.error('Please verify your email before signing in');
        return;
      }

      toast.success('Signed in successfully!');
      router.push('/onboarding');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error('Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSignIn} className="space-y-6">
        <div className="space-y-4">
          <div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-text-secondary"
              placeholder="Email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder-text-secondary"
              placeholder="Password"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="btn-primary w-full flex justify-center py-3 px-4 rounded-lg disabled:opacity-50 font-medium text-base"
          >
            {cooldown > 0 ? (
              `Wait ${cooldown}s`
            ) : loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="flex items-center justify-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 text-primary focus:ring-primary border-border rounded bg-background"
              required
            />
            <label htmlFor="terms" className="text-sm text-text-secondary">
              I agree to the{' '}
              <a href="/terms" className="text-primary hover:text-primary-hover">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:text-primary-hover">
                Privacy Policy
              </a>
            </label>
          </div>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-secondary text-text-secondary">Or continue with</span>
        </div>
      </div>

      <GoogleSignInButton />
    </div>
  );
} 