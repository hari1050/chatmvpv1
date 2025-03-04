'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('overview');
  
  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'information-collection', title: 'Information We Collect' },
    { id: 'data-usage', title: 'How We Use Your Information' },
    { id: 'data-sharing', title: 'Data Sharing & Third Parties' },
    { id: 'cookies', title: 'Cookies & Tracking' },
    { id: 'security', title: 'Data Security & Retention' },
    { id: 'your-rights', title: 'Your Rights & Choices' },
    { id: 'compliance', title: 'Compliance' },
    { id: 'updates', title: 'Updates to Policy' },
    { id: 'contact', title: 'Contact Information' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
            <Link 
              href="/dashboard" 
              className="flex items-center px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-secondary hover:bg-secondary-hover rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
          <p className="text-text-secondary mt-2">
            Last Updated: 04-03-2025
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-secondary rounded-lg p-4 sticky top-8">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Contents</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary text-black font-medium'
                        : 'text-text-secondary hover:text-text-primary hover:bg-secondary-hover'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 bg-secondary rounded-lg p-6">
            {activeSection === 'overview' && (
              <section id="overview">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Overview</h2>
                <p className="text-text-secondary mb-4">
                  This Privacy Policy explains how HumaneChat ("we," "us," or "our") collects, uses, and protects information when you use our AI-powered chatbot service on Shopify (the "Service"). By using the Service, you consent to the practices described in this policy.
                </p>
              </section>
            )}

            {activeSection === 'information-collection' && (
              <section id="information-collection">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Information We Collect</h2>
                <p className="text-text-secondary mb-4">
                  We collect and process the following types of information:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-[#1a1a1a] rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-foreground">1.1 Merchant Information</h3>
                    <ul className="list-disc list-inside mt-2 text-text-secondary">
                      <li>Name, email, and business details provided during account registration.</li>
                      <li>Shopify store information, including settings and configurations.</li>
                      <li>Payment details (processed through Shopify's payment system; we do not store payment data).</li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#1a1a1a] rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-foreground">1.2 Customer Information</h3>
                    <ul className="list-disc list-inside mt-2 text-text-secondary">
                      <li>Chatbot interactions, including FAQs and support queries.</li>
                      <li>Non-personally identifiable browsing and behavioral data.</li>
                      <li>Customer preferences, inquiries, and responses within the chatbot.</li>
                    </ul>
                    <p className="text-text-secondary mt-2">
                      Note: We do not collect sensitive customer data such as payment details, credit card information, or addresses.
                    </p>
                  </div>
                  
                  <div className="bg-[#1a1a1a] rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-foreground">1.3 Automatically Collected Data</h3>
                    <ul className="list-disc list-inside mt-2 text-text-secondary">
                      <li>Log files, IP addresses, browser type, and usage patterns.</li>
                      <li>Cookies and tracking technologies (see Section 4 for details).</li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'data-usage' && (
              <section id="data-usage">
                <h2 className="text-2xl font-bold mb-4 text-foreground">How We Use Your Information</h2>
                <p className="text-text-secondary mb-4">
                  We use the collected data to:
                </p>
                <ul className="list-disc list-inside mb-4 text-text-secondary">
                  <li>Provide, operate, and improve our AI chatbot service.</li>
                  <li>Respond to customer queries and automate support using FAQs.</li>
                  <li>Optimize chatbot responses based on usage trends.</li>
                  <li>Ensure compliance with Shopify's policies and relevant laws.</li>
                  <li>Enhance security and prevent fraudulent activities.</li>
                </ul>
              </section>
            )}

            {activeSection === 'data-sharing' && (
              <section id="data-sharing">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Data Sharing & Third Parties</h2>
                <p className="text-text-secondary mb-4">
                  We do not sell, rent, or trade personal data. However, we may share data with:
                </p>
                <ul className="list-disc list-inside mb-4 text-text-secondary">
                  <li><span className="font-medium">Shopify:</span> To comply with their policies and facilitate seamless integration.</li>
                  <li><span className="font-medium">Service Providers:</span> Cloud hosting, analytics, and AI processing partners bound by strict confidentiality agreements.</li>
                  <li><span className="font-medium">Legal Compliance:</span> When required by law, such as responding to lawful requests by authorities.</li>
                </ul>
              </section>
            )}

            {activeSection === 'cookies' && (
              <section id="cookies">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Cookies & Tracking Technologies</h2>
                <p className="text-text-secondary mb-4">
                  We use cookies and tracking technologies to enhance chatbot interactions and improve user experience.
                </p>
              </section>
            )}

            {activeSection === 'security' && (
              <section id="security">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Data Security & Retention</h2>
                <p className="text-text-secondary mb-4">
                  We implement industry-standard security measures, including encryption and access controls, to protect your data. Data is retained as long as necessary for service functionality and compliance.
                </p>
                <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Data Retention Periods:</h3>
                  <ul className="list-disc list-inside text-text-secondary">
                    <li>Chatbot interactions: Retained for up to 12 months.</li>
                    <li>Merchant account details: Retained as long as the account is active.</li>
                    <li>Aggregated usage data: Retained for analytics and service improvements.</li>
                  </ul>
                </div>
              </section>
            )}

            {activeSection === 'your-rights' && (
              <section id="your-rights">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Your Rights & Choices</h2>
                <p className="text-text-secondary mb-4">
                  As a merchant or customer, you have the right to:
                </p>
                <ul className="list-disc list-inside mb-4 text-text-secondary">
                  <li>Access and update your personal information.</li>
                  <li>Request deletion of certain data (subject to legal and operational limitations).</li>
                  <li>Opt-out of data collection (may affect service functionality).</li>
                </ul>
                <p className="text-text-secondary">
                  To exercise your rights, contact us at humanechat@gmail.com.
                </p>
              </section>
            )}

            {activeSection === 'compliance' && (
              <section id="compliance">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Compliance with Shopify & Privacy Laws</h2>
                <p className="text-text-secondary mb-4">
                  We comply with:
                </p>
                <ul className="list-disc list-inside mb-4 text-text-secondary">
                  <li>Shopify's App Privacy Requirements (<a href="https://shopify.dev/docs/apps/launch/privacy-requirements" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">shopify.dev</a>)</li>
                  <li>GDPR (for EU users)</li>
                  <li>CCPA/CPRA (for California users)</li>
                  <li>Other applicable privacy regulations</li>
                </ul>
                <p className="text-text-secondary">
                  If you are a California resident, you can request disclosure of data collected under CPRA.
                </p>
              </section>
            )}

            {activeSection === 'updates' && (
              <section id="updates">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Updates to this Privacy Policy</h2>
                <p className="text-text-secondary">
                  We may update this policy periodically. Changes will be posted on this page, and material updates will be notified to users.
                </p>
              </section>
            )}

            {activeSection === 'contact' && (
              <section id="contact">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Contact Information</h2>
                <p className="text-text-secondary mb-4">
                  For any privacy-related concerns or requests, please contact us at:
                </p>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-text-secondary">
                    <strong>HumaneChat Support</strong><br />
                    Email: humanechat@gmail.com
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}