'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import ChatbotCard from '@/components/chat/ChatbotCard';
import ChatWidget from '@/components/chat/ChatWidget';
import type { Chatbot } from '@/types';
import { set } from 'lodash';

export default function ChatbotsPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [previewChatbot, setPreviewChatbot] = useState<Chatbot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user_id, setid] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadChatbots();
  }, []);

  const loadChatbots = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setid(user.id);
      }
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChatbots(data || []);
    } catch (error) {
      console.error('Error loading chatbots:', error);
      toast.error('Failed to load chatbots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewChatbot = () => {
    // If there's an existing chatbot, use its settings as default
    if (chatbots.length > 0) {
      const lastChatbot = chatbots[0]; // Most recent chatbot
      router.push('/onboarding?defaults=' + encodeURIComponent(JSON.stringify({
        chatbotName: '',
        name: lastChatbot.settings.userName,
        companyName: lastChatbot.settings.name,
        brandColor: lastChatbot.settings.primaryColor,
        chatBackgroundColor: lastChatbot.settings.chatBackgroundColor,
        fontFamily: lastChatbot.settings.fontFamily,
        aiTone: lastChatbot.settings.aiTone
      })));
    } else {
      router.push('/onboarding');
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
        <h1 className="text-2xl font-bold text-foreground">Your Chatbots</h1>
        <button
          onClick={handleCreateNewChatbot}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Create New Chatbot
        </button>
      </div>

      <div className="space-y-8">
        {/* Chatbot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map(chatbot => (
            <ChatbotCard
              key={chatbot.id}
              chatbot={chatbot}
              onPreviewClick={setPreviewChatbot}
            />
          ))}
        </div>

        {/* Empty State */}
        {chatbots.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-text-secondary mb-2">No chatbots yet</h3>
            <p className="text-text-secondary mb-4">Create your first chatbot to get started</p>
            <button
              onClick={handleCreateNewChatbot}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create New Chatbot
            </button>
          </div>
        )}

        {/* Preview Section */}
        {previewChatbot && (
          <div className="mt-8 p-6 bg-[#2a2a2a] rounded-lg border border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Live Preview: {previewChatbot.name}</h2>
              <button
                onClick={() => setPreviewChatbot(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-w-md mx-auto">
              <ChatWidget settings={previewChatbot.settings} user_id={user_id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 