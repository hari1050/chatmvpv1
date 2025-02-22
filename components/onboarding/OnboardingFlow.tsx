'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingFlow() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome to Chatbot Setup</h1>
        <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
          <p className="text-gray-300 mb-4">
            Let's get started with setting up your chatbot.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
} 