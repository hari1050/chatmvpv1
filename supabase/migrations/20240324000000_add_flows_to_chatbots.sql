-- Add flows column to chatbots table
ALTER TABLE public.chatbots
ADD COLUMN flows jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Create index for better performance
CREATE INDEX idx_chatbots_flows ON public.chatbots USING gin(flows); 