import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Started | Humane',
  description: 'Set up your AI chatbot in minutes',
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      {children}
    </main>
  );
} 