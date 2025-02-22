import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Humane AI - Build Intelligent Chatbots',
  description: 'Create AI-powered chatbots that understand your business and help convert visitors into customers.',
  keywords: 'real estate chatbot, chatbot for real estate, realtor chatbot, chatbot for realtors, estate agent chatbot, chatbot for estate agents, website chatbot, facebook chatbot',
  metadataBase: new URL('https://humanechat.com'),
  openGraph: {
    title: 'The Perfect Chatbot for Real Estate Agents | Convoboss®',
    description: 'The ideal chatbot for real estate agents to nurture leads, drive sales, and engage with property buyers and sellers.',
    url: 'https://humanechat.com',
    type: 'website',
  },
  themeColor: '#5d52f9',
  icons: {
    icon: '/Logo maker project (1).png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/Logo maker project (1).png" />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }
              }}
            />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
