import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Chatbot } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import EmbedCodeModal from './EmbedCodeModal';

interface ChatbotCardProps {
  chatbot: Chatbot;
  onPreviewClick: (chatbot: Chatbot) => void;
}

export default function ChatbotCard({ chatbot, onPreviewClick }: ChatbotCardProps) {
  const router = useRouter();
  const createdAt = new Date(chatbot.created_at);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  const handleEditClick = () => {
    router.push(`/onboarding?edit=${encodeURIComponent(JSON.stringify({
      chatbotId: chatbot.id,
      chatbotName: chatbot.name,
      name: chatbot.settings.userName,
      companyName: chatbot.settings.name,
      brandColor: chatbot.settings.primaryColor,
      chatBackgroundColor: chatbot.settings.chatBackgroundColor,
      logo: chatbot.settings.logo,
      fontFamily: chatbot.settings.fontFamily,
      aiTone: chatbot.settings.aiTone
    }))}`);
  };

  return (
    <>
      <div className="relative bg-[#1e1e1e] rounded-xl shadow-lg overflow-hidden border border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            {chatbot.settings.logo ? (
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30">
                <Image
                  src={chatbot.settings.logo}
                  alt={`${chatbot.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">
                  {chatbot.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white truncate">
                {chatbot.name}
              </h3>
              <p className="text-sm text-text-secondary">
                {chatbot.settings.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-700">
            <button
              onClick={handleEditClick}
              className="flex flex-col items-center justify-center text-sm text-gray-400 hover:text-white transition-colors py-2 rounded-lg hover:bg-gray-700/50 space-y-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span>Edit</span>
            </button>
            <button
              onClick={() => onPreviewClick(chatbot)}
              className="flex flex-col items-center justify-center text-sm text-gray-400 hover:text-white transition-colors py-2 rounded-lg hover:bg-gray-700/50 space-y-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span>Preview</span>
            </button>
            <button
              onClick={() => setShowEmbedModal(true)}
              className="flex flex-col items-center justify-center text-sm text-gray-400 hover:text-white transition-colors py-2 rounded-lg hover:bg-gray-700/50 space-y-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Embed</span>
            </button>
          </div>
        </div>
      </div>

      <EmbedCodeModal
        isOpen={showEmbedModal}
        onClose={() => setShowEmbedModal(false)}
        chatbot={chatbot}
      />
    </>
  );
}