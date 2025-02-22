'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  flow: string;
  location?: string;
  created_at: string;
}

export default function CustomerInfoPage() {
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customer info:', error);
      toast.error('Failed to load customer information');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Customer Inquiries</h1>
      </div>

      <div className="space-y-8">
        {/* Customer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map(customer => (
            <div 
              key={customer.id} 
              className="relative bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden border border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              {/* Date Badge */}
              <div className="absolute top-4 right-4 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">
                {formatDistanceToNow(new Date(customer.created_at), { addSuffix: true })}
              </div>

              {/* Flow Tag */}
              <div className="absolute top-4 left-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                  {customer.flow} Inquiry
                </span>
              </div>

              {/* Customer Details */}
              <div className="p-6 pt-16">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{customer.name}</h3>
                  <div className="space-y-2">
                    <p className="text-text-secondary flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {customer.email}
                    </p>
                    <p className="text-text-secondary flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {customer.phone}
                    </p>
                    {customer.location && (
                      <p className="text-text-secondary flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {customer.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {customers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-text-secondary mb-2">No customer inquiries yet</h3>
            <p className="text-text-secondary mb-4">Customer inquiries will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}