'use client';

import Link from 'next/link';
import Image from 'next/image';
import ChatWidget from '@/components/chat/ChatWidget';
import Navbar from '@/components/layout/Navbar';
import { MessageSquare, Settings, BarChart3, Layout, Plus, Bot } from 'lucide-react';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import { useState } from 'react';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const calculateYearlyPrice = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12;
    const discount = yearlyPrice * 0.2; // 20% discount
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32 bg-background">
        <div className="section-container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="flex flex-col space-y-8">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight animate-fade-up">
                The Perfect Chatbot for
                <span className="text-gradient"> Real Estate Agents</span>
          </h1>
              
              <p className="text-lg sm:text-xl text-text-secondary max-w-2xl animate-fade-up">
            Nurture leads, drive sales, and engage with property buyers and sellers.
          </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up">
            <Link
              href="/auth"
                  className="btn-primary inline-flex items-center justify-center"
            >
                  Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
                <button
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  View Demo
                </button>
              </div>
            </div>

            {/* Right Side - Feature Showcase */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[500px] h-[500px]">
                  {/* Spinning Circle */}
                  <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                    {/* Chat Interface */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-secondary/50 w-24 h-24 rounded-xl border border-border flex items-center justify-center group hover:border-primary/50 transition-all">
                        <MessageSquare className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    {/* Analytics Dashboard */}
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
                      <div className="bg-secondary/50 w-24 h-24 rounded-xl border border-border flex items-center justify-center group hover:border-primary/50 transition-all">
                        <BarChart3 className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    {/* Layout Customization */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                      <div className="bg-secondary/50 w-24 h-24 rounded-xl border border-border flex items-center justify-center group hover:border-primary/50 transition-all">
                        <Layout className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    {/* AI Configuration */}
                    <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-secondary/50 w-24 h-24 rounded-xl border border-border flex items-center justify-center group hover:border-primary/50 transition-all">
                        <Bot className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    {/* Settings (Center) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-secondary/50 w-24 h-24 rounded-xl border border-border flex items-center justify-center group hover:border-primary/50 transition-all">
                        <Settings className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors animate-spin-slow" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-secondary/30">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Humane AI <span className="text-gradient">Live Demo</span>
            </h2>
            <p className="text-text-secondary text-lg">
              Interact live with our AI to see how it helps capture leads for you.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              <ChatWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="why-humane" className="py-20 bg-background">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why <span className="text-gradient">HumaneChat?</span>
          </h2>
          </div>

          {/* Value Props with Animated Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter
                  end={30}
                  prefix="+"
                  suffix="%"
                  color="#ff4d4d"
                />
              </div>
              <p className="text-text-secondary text-sm">
                more leads
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter
                  end={80}
                  suffix="%"
                  color="#00bcd4"
                />
              </div>
              <p className="text-text-secondary text-sm">
                higher engagement
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter
                  end={70}
                  suffix="%"
                  color="#4caf50"
                />
              </div>
              <p className="text-text-secondary text-sm">
                more cost savings
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter
                  end={70}
                  suffix="%"
                  color="#ff9800"
                />
              </div>
              <p className="text-text-secondary text-sm">
                increase in support agent productivity
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card group hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold mb-4">24/7 Lead Capture & Qualification</h3>
              <p className="text-text-secondary">Never miss a potential client. Our chatbot engages with visitors around the clock.</p>
            </div>
            <div className="card group hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold mb-4">Automated Property Inquiries</h3>
              <p className="text-text-secondary">Handle property inquiries automatically and collect relevant information.</p>
            </div>
            <div className="card group hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold mb-4">Customized Branding</h3>
              <p className="text-text-secondary">Personalize your chatbot with your brand colors, logo, and agent name for a seamless experience.</p>
            </div>
            <div className="card group hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-semibold mb-4">Customer Analytics</h3>
              <p className="text-text-secondary">Track and analyze all chatbot conversations with visitors through your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-text-secondary text-center mb-12">
            Have another question? Contact us by{' '}
            <a href="mailto:support@humanechat.com" className="text-primary hover:text-primary-hover underline">
              email
            </a>
          </p>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="card group hover:border-primary/50 transition-colors">
                <button 
                  className="w-full text-left"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{faq.question}</h3>
                    <svg 
                      className={`w-5 h-5 text-primary transform transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div 
                    className={`mt-4 text-text-secondary space-y-4 overflow-hidden transition-all duration-300 ${
                      openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {typeof faq.answer === 'string' ? (
                      <p>{faq.answer}</p>
                    ) : (
                      faq.answer.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-secondary/30">
        <div className="section-container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Simple, <span className="text-gradient">Transparent Pricing</span>
          </h2>

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
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  25,000 Messages a month
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  10 Chatbots
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom knowledgebase
                </li>
              </ul>
              <button className="btn-primary w-full">
                Get started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="card border-primary/50">
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-8">
                {getPriceDisplay(59)}
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited support tickets
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  50,000 Messages
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  20 Chatbots
                </li>
                <li className="flex items-center text-text-secondary">
                  <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom knowledgebase
                </li>
              </ul>
              <button className="btn-primary w-full">
                Get started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="section-container text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Capture more leads, <span className="text-gradient">earn more commissions</span>
          </h2>
          <p className="text-text-secondary text-lg mb-12 max-w-2xl mx-auto">
            Every visitor on your website is a potential lead for your business. Don't miss it out.
          </p>
          <Link
            href="/auth"
            className="btn-primary inline-flex items-center justify-center text-lg"
          >
            Try Humane today
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-background">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Image
                  src="/Logo maker project (1).png"
                  alt="Humane AI Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-lg font-bold tracking-tight">Humane AI</span>
              </div>
              <p className="text-text-secondary">
                Capture all your leads with Humane AI
              </p>
            </div>

            {/* Links Section */}
            <div>
              <h3 className="font-semibold mb-4">Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/auth" className="text-text-secondary hover:text-text-primary transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('pricing');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <a 
                    href="mailto:support@humanechat.com" 
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a 
                    href="https://discord.gg/Ef8AmY9P"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <span>Join our Community</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-text-secondary hover:text-text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-text-secondary hover:text-text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-text-secondary">
            <p>&copy; 2024 Humane AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const faqs = [
  {
    question: "What do I get after subscribing to the plan?",
    answer: "A customizable, done for you, ready-to-launch chatbot, which can be installed on your website."
  },
  {
    question: "How much does Humane cost?",
    answer: "Our pricing starts at $29/m but we let all our users try Humane for free for 7 days."
  },
  {
    question: "Can I cancel or downgrade my plan?",
    answer: [
      "Yes, you can downgrade or cancel your chatbot plan at any time, but the current subscription will remain active until the next billing due date.",
      "If you require a refund within the 7-day trial period, please contact support@humanechat.com and provide your purchase receipt.",
      "Refunds via credit card typically take 3-5 working days to credit back into a customer's account."
    ]
  },
  {
    question: "Can I get a copy of my receipt?",
    answer: "Yes, receipts will be delivered to the email address used when making your initial subscription payment."
  },
  {
    question: "Where can I install the chatbot?",
    answer: [
      "We support the deployment of the chatbot via website chat widgets.",
      "It takes as little as five minutes to set up and live your chatbot on a website."
    ]
  },
  {
    question: "What if I need some help after purchasing a bot?",
    answer: "We provide email support for all of our clients. We also help set up the chatbot for you."
  }
];
