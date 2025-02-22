// app/widget/[chatbotId]/WidgetClient.tsx
'use client';

import ChatWidget from '@/components/chat/ChatWidget';
import type { Chatbot } from '@/types';

export default function WidgetClient({
  chatbot
}: {
  chatbot: Chatbot;
}) {
  return (
    <div className="min-h-screen bg-black">
      <ChatWidget 
        settings={chatbot.settings} 
        user_id={chatbot.user_id}
        isEmbedded={true}
      />
    </div>
  );
}