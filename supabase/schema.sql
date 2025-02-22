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

-- Create users table (extends auth.users)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  agent_name text,
  agent_description text,
  photo_url text,
  brand_colors jsonb default '{"primary": "#2563eb"}'::jsonb,
  setup_completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create chat conversations table
create table if not exists public.chat_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  visitor_session_id uuid not null,
  lead_captured boolean default false,
  lead_email text,
  lead_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create chat messages table
create table if not exists public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.chat_conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now()
);

-- Create chatbots table
create table if not exists public.chatbots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  settings jsonb default '{"primaryColor": "#5d52f9", "fontFamily": "Inter", "aiTone": "professional", "predefinedQuestions": []}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chatbots enable row level security;

-- Create RLS policies

-- Users table policies
create policy "Public profiles are viewable by everyone"
  on public.users for select
  using (true);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Enable insert for authenticated users only"
  on public.users for insert
  with check (auth.role() = 'authenticated');

-- Chat conversations policies
create policy "Users can view their own conversations"
  on public.chat_conversations for select
  using (auth.uid() = user_id);

create policy "Anyone can insert conversations"
  on public.chat_conversations for insert
  with check (true);

create policy "Users can update their own conversations"
  on public.chat_conversations for update
  using (auth.uid() = user_id);

-- Chat messages policies
create policy "Users can view messages in their conversations"
  on public.chat_messages for select
  using (
    exists (
      select 1 from public.chat_conversations
      where id = chat_messages.conversation_id
      and user_id = auth.uid()
    )
  );

create policy "Anyone can insert messages"
  on public.chat_messages for insert
  with check (true);

-- RLS policies for chatbots
create policy "Users can view their own chatbots"
  on public.chatbots for select
  using (auth.uid() = user_id);

create policy "Users can insert their own chatbots"
  on public.chatbots for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own chatbots"
  on public.chatbots for update
  using (auth.uid() = user_id);

create policy "Users can delete their own chatbots"
  on public.chatbots for delete
  using (auth.uid() = user_id);

-- Create functions for automatic updating of updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.chat_conversations
  for each row
  execute function public.handle_updated_at();

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger security definer as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user(); 