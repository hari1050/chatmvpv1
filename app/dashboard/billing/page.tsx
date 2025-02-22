// app/billing/page.tsx
'use client';

import { useState } from 'react';
import { createCheckoutSession } from '@/app/actions/stripe';
import toast from 'react-hot-toast';

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const calculateYearlyPrice = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12;
    const discount = yearlyPrice * 0.2;
    return Math.floor(yearlyPrice - discount);
  };

  const getPriceDisplay = (monthlyPrice: number) => {
    if (billingCycle === 'monthly') {
      return (
        <>
          ${monthlyPrice}<span className="text-xl font-normal text-text-secondary">/mo</span>
          <span className="text-sm font-normal text-primary ml-2">[20% off annually]</span>
        </>
      );
    } else {
      const yearlyPrice = calculateYearlyPrice(monthlyPrice);
      return (
        <>
          ${yearlyPrice}<span className="text-xl font-normal text-text-secondary">/year</span>
          <span className="text-sm font-normal text-primary ml-2">[20% off]</span>
        </>
      );
    }
  };

  const handleCheckout = async (plan: 'starter' | 'pro') => {
    try {
      setIsLoading(plan);
      const loadingToast = toast.loading('Preparing checkout...');
      
      const { url } = await createCheckoutSession(plan, billingCycle);
      
      toast.dismiss(loadingToast);
      window.location.href = url;
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-foreground">Billing & Plans</h1>

      {/* Billing Toggle */}
      <div className="flex justify-center items-center space-x-4 mb-12">
        <button 
          className={`px-4 py-2 rounded-lg transition-colors ${
            billingCycle === 'monthly' 
              ? 'bg-primary text-black' 
              : 'bg-secondary text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition-colors ${
            billingCycle === 'yearly' 
              ? 'bg-primary text-black' 
              : 'bg-secondary text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setBillingCycle('yearly')}
        >
          Yearly
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Starter Plan */}
        <div className="card">
          <h3 className="text-2xl font-bold mb-4">Starter</h3>
          <div className="text-4xl font-bold mb-8">
            {getPriceDisplay(29)}
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center text-text-secondary">
              <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Unlimited support tickets
            </li>
            {/* ... other list items ... */}
          </ul>
          <button 
            className="btn-primary w-full"
            onClick={() => handleCheckout('starter')}
            disabled={isLoading === 'starter'}
          >
            {isLoading === 'starter' ? 'Loading...' : 'Get started'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="card border-primary/50">
          <h3 className="text-2xl font-bold mb-4">Pro</h3>
          <div className="text-4xl font-bold mb-8">
            {getPriceDisplay(59)}
          </div>
          <ul className="space-y-4 mb-8">
            {/* ... list items ... */}
          </ul>
          <button 
            className="btn-primary w-full"
            onClick={() => handleCheckout('pro')}
            disabled={isLoading === 'pro'}
          >
            {isLoading === 'pro' ? 'Loading...' : 'Get started'}
          </button>
        </div>
      </div>
    </div>
  );
}