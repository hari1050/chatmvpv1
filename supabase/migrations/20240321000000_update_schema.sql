-- Add default settings to chatbots table
ALTER TABLE public.chatbots
ALTER COLUMN settings SET DEFAULT '{
  "name": "AI Assistant",
  "primaryColor": "#2563eb",
  "fontFamily": "Inter",
  "aiTone": "professional",
  "faqs": [
    "What properties are available?",
    "How can I schedule a viewing?",
    "What are the current market trends?",
    "Can you help me sell my property?"
  ]
}'::jsonb;

-- Add visitor_info to chat_conversations
ALTER TABLE public.chat_conversations
ADD COLUMN visitor_info jsonb DEFAULT '{}'::jsonb;

-- Add metadata to chat_messages
ALTER TABLE public.chat_messages
ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;

-- Create view for chat statistics
CREATE VIEW chat_statistics AS
SELECT 
  c.user_id,
  COUNT(DISTINCT cc.id) as total_conversations,
  COUNT(DISTINCT CASE WHEN cc.lead_captured THEN cc.id END) as leads_captured,
  COUNT(cm.id) as total_messages,
  MAX(cc.created_at) as last_conversation
FROM public.chatbots c
LEFT JOIN public.chat_conversations cc ON c.user_id = cc.user_id
LEFT JOIN public.chat_messages cm ON cc.id = cm.conversation_id
GROUP BY c.user_id; 