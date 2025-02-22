// app/actions/stripe.ts
'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia'
})

// Define your price IDs from Stripe Dashboard
const PRICE_IDS = {
  starter: {
    monthly: 'price_1QvLckIEKcR3FD8AxunGd1fi',
    yearly: 'price_1QvLckIEKcR3FD8AlSYNGMy1'
  },
  pro: {
    monthly: 'price_1QvLdFIEKcR3FD8AICLFxQd9',
    yearly: 'price_1QvLdgIEKcR3FD8AshTucXbJ'
  }
} as const

export async function createCheckoutSession(plan: 'starter' | 'pro', billingCycle: 'monthly' | 'yearly') {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      throw new Error('Not authenticated')
    }

    const priceId = PRICE_IDS[plan][billingCycle]

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: {
        userId: session.user.id,
        plan,
        billingCycle
      }
    })

    if (!checkoutSession.url) {
      throw new Error('Failed to create checkout session')
    }

    return { url: checkoutSession.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}