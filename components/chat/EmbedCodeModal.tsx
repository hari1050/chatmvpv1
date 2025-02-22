import { useState } from 'react';
import type { Chatbot } from '@/types';
import { toast } from 'react-hot-toast';

interface EmbedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatbot: Chatbot;
}

export default function EmbedCodeModal({ isOpen, onClose, chatbot }: EmbedCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const embedCode = `<script>
  (function(w,d,c) {
    var s = d.createElement('script');
    s.src = '${process.env.NEXT_PUBLIC_APP_URL}/widget-loader.js';
    s.onload = function() {
      w.__ChatWidget.init({
        chatbotId: '${chatbot.id}',
        settings: ${JSON.stringify(chatbot.settings)}
      });
    };
    d.head.appendChild(s);
  })(window,document);
</script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast.success('Embed code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#2a2a2a] rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Add Chatbot to Your Website</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300">
              Add this code to your website's HTML, just before the closing &lt;/body&gt; tag:
            </p>

            <div className="relative">
              <pre className="bg-black rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                {embedCode}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-3 py-1 bg-[#5d52f9] text-white rounded hover:bg-[#4a41f8] text-sm"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Copy the code above</li>
                <li>Paste it into your website's HTML file</li>
                <li>Place it just before the closing &lt;/body&gt; tag</li>
                <li>Save and reload your website</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}