-- Enable necessary extensions
create extension if not exists "vector" with schema public;

-- Drop existing triggers first
drop trigger if exists on_auth_user_created on auth.users;

-- Drop existing tables if they exist (for clean setup)
-- Drop in correct order based on dependencies
drop table if exists public.leads cascade;
drop table if exists public.chat_messages cascade;
drop table if exists public.chat_conversations cascade;
drop table if exists public.users cascade;

-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  agent_name text,
  agent_description text,
  setup_completed boolean default false,
  brand_colors jsonb default '{"primary": "#5d52f9"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chatbots table
create table public.chatbots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  settings jsonb not null default '{
    "primaryColor": "#5d52f9",
    "fontFamily": "Inter",
    "aiTone": "professional",
    "predefinedQuestions": []
  }'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chat_conversations table
create table public.chat_conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  chatbot_id uuid references public.chatbots(id) on delete cascade,
  visitor_session_id uuid not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create chat_messages table
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.chat_conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.chatbots enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

-- Create policies
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can view own chatbots"
  on public.chatbots for select
  using (auth.uid() = user_id);

create policy "Users can insert own chatbots"
  on public.chatbots for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chatbots"
  on public.chatbots for update
  using (auth.uid() = user_id);

create policy "Users can delete own chatbots"
  on public.chatbots for delete
  using (auth.uid() = user_id);

create policy "Users can view own conversations"
  on public.chat_conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert conversations"
  on public.chat_conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can view messages from own conversations"
  on public.chat_messages for select
  using (
    exists (
      select 1
      from public.chat_conversations
      where id = chat_messages.conversation_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert messages to own conversations"
  on public.chat_messages for insert
  with check (
    exists (
      select 1
      from public.chat_conversations
      where id = conversation_id
      and user_id = auth.uid()
    )
  );

-- Create functions
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert test agent
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'test-agent-id',
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Insert test agent profile
INSERT INTO public.users (
  id,
  email,
  agent_name,
  agent_description,
  setup_completed,
  brand_colors
) VALUES (
  'test-agent-id',
  'test@example.com',
  'John Smith',
  'Experienced real estate agent specializing in Florida properties with over 10 years of experience.',
  true,
  '{"primary": "#2563eb"}'
) ON CONFLICT (id) DO NOTHING;
