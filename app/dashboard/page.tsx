'use client';

import { useState , useEffect} from 'react';
import ChatbotCustomizer from '@/components/chat/ChatbotCustomizer';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ChatWidget from '@/components/chat/ChatWidget';
import type { ChatbotSettings } from '@/types';

export default function DashboardPage() {
  const [settings, setSettings] = useState<ChatbotSettings>({
    name: 'My Chatbot',
    chatbotName: 'My Chatbot',
    userName: '',
    primaryColor: '#ffc107',
    chatBackgroundColor: '#1a1a1a',
    fontFamily: 'Inter',
    aiTone: 'professional',
    predefinedQuestions: [],
    logo: ''
  });
  const [user_id, setid] = useState<string | undefined>(undefined);

  useEffect(() => {
    loaduserid();
  }, []);

  const loaduserid = async () => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setid(user.id);
    }
  };

  const handleSettingsUpdate = (newSettings: ChatbotSettings) => {
    setSettings({
      ...newSettings,
      chatbotName: newSettings.name // Ensure chatbot name is synced
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Customize Your Chatbot</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Branding Customization */}
          <div>
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
              <ChatbotCustomizer
                chatbotId="new"
                initialSettings={settings}
                onUpdate={handleSettingsUpdate}
              />
            </div>
          </div>

          {/* Right side - Live Preview */}
          <div>
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
              <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
              <p className="text-gray-400 mb-4">See how your chatbot will appear to visitors</p>
              <ChatWidget settings={settings} user_id={user_id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 