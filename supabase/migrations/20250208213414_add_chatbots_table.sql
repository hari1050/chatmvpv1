-- Create chatbots table
create table if not exists public.chatbots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  settings jsonb default '{"primaryColor": "#5d52f9", "fontFamily": "Inter", "aiTone": "professional", "predefinedQuestions": []}'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for chatbots
alter table public.chatbots enable row level security;

-- Create RLS policies for chatbots
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

-- Add updated_at trigger
create trigger handle_updated_at
  before update on public.chatbots
  for each row
  execute function public.handle_updated_at();
