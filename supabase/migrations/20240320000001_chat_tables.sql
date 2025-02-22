-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    visitor_session_id UUID NOT NULL,
    flow_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow users to create their own conversations"
    ON public.chat_conversations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow users to view their own conversations"
    ON public.chat_conversations FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow users to update their own conversations"
    ON public.chat_conversations FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Create conversation_steps table
CREATE TABLE IF NOT EXISTS public.conversation_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.chat_conversations(id),
    step_type TEXT NOT NULL,
    flow_name TEXT NOT NULL,
    user_input TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.conversation_steps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for conversation_steps
CREATE POLICY "Allow users to create steps for their conversations"
    ON public.conversation_steps FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.chat_conversations
        WHERE id = conversation_id
        AND (user_id = auth.uid() OR user_id IS NULL)
    ));

CREATE POLICY "Allow users to view steps of their conversations"
    ON public.conversation_steps FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.chat_conversations
        WHERE id = conversation_id
        AND (user_id = auth.uid() OR user_id IS NULL)
    ));

-- Create conversation_analytics table
CREATE TABLE IF NOT EXISTS public.conversation_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.chat_conversations(id),
    flow_name TEXT NOT NULL,
    completion_status TEXT NOT NULL,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    steps_completed INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.conversation_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for conversation_analytics
CREATE POLICY "Allow users to create analytics for their conversations"
    ON public.conversation_analytics FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.chat_conversations
        WHERE id = conversation_id
        AND (user_id = auth.uid() OR user_id IS NULL)
    ));

CREATE POLICY "Allow users to view analytics of their conversations"
    ON public.conversation_analytics FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.chat_conversations
        WHERE id = conversation_id
        AND (user_id = auth.uid() OR user_id IS NULL)
    )); 