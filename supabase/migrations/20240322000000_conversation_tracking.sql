-- Add flow_data to chat_conversations
ALTER TABLE public.chat_conversations
ADD COLUMN flow_data jsonb DEFAULT '{}'::jsonb;

-- Add conversation_steps table for detailed flow tracking
CREATE TABLE IF NOT EXISTS public.conversation_steps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  step_type text NOT NULL,
  flow_name text NOT NULL,
  user_input text,
  bot_response text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Add conversation_analytics table
CREATE TABLE IF NOT EXISTS public.conversation_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  flow_name text NOT NULL,
  completion_status text NOT NULL,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  duration_seconds integer,
  steps_completed integer,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.conversation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own conversation steps"
  ON public.conversation_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations cc
      WHERE cc.id = conversation_id
      AND cc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own conversation steps"
  ON public.conversation_steps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations cc
      WHERE cc.id = conversation_id
      AND cc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own conversation analytics"
  ON public.conversation_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations cc
      WHERE cc.id = conversation_id
      AND cc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own conversation analytics"
  ON public.conversation_analytics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations cc
      WHERE cc.id = conversation_id
      AND cc.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX idx_conversation_steps_conversation_id ON public.conversation_steps(conversation_id);
CREATE INDEX idx_conversation_steps_flow_name ON public.conversation_steps(flow_name);
CREATE INDEX idx_conversation_analytics_conversation_id ON public.conversation_analytics(conversation_id);
CREATE INDEX idx_conversation_analytics_flow_name ON public.conversation_analytics(flow_name);

-- Create view for conversation statistics
CREATE OR REPLACE VIEW conversation_statistics AS
SELECT 
  cc.user_id,
  ca.flow_name,
  COUNT(*) as total_conversations,
  COUNT(CASE WHEN ca.completion_status = 'completed' THEN 1 END) as completed_conversations,
  AVG(ca.duration_seconds) as avg_duration_seconds,
  AVG(ca.steps_completed) as avg_steps_completed
FROM public.chat_conversations cc
JOIN public.conversation_analytics ca ON cc.id = ca.conversation_id
GROUP BY cc.user_id, ca.flow_name; 