-- Drop the column if it exists to avoid conflicts
ALTER TABLE public.chat_conversations 
DROP COLUMN IF EXISTS flow_data;

-- Add flow_data column with correct type and default
ALTER TABLE public.chat_conversations 
ADD COLUMN flow_data jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_chat_conversations_flow_data 
ON public.chat_conversations USING gin(flow_data); 