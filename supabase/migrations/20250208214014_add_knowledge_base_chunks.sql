-- Create knowledge_base_chunks table
create table if not exists public.knowledge_base_chunks (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  metadata jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add text search capabilities
alter table public.knowledge_base_chunks
  add column if not exists content_vector tsvector
  generated always as (to_tsvector('english', content)) stored;

-- Create index for full text search
create index if not exists knowledge_base_chunks_content_vector_idx
  on public.knowledge_base_chunks using gin(content_vector);

-- Create index for user_id lookups
create index if not exists knowledge_base_chunks_user_id_idx
  on public.knowledge_base_chunks using btree(((metadata->>'userId')::uuid));

-- Enable RLS
alter table public.knowledge_base_chunks enable row level security;

-- RLS policies
create policy "Users can view their own knowledge base chunks"
  on public.knowledge_base_chunks for select
  using ((metadata->>'userId')::uuid = auth.uid());

create policy "Users can insert their own knowledge base chunks"
  on public.knowledge_base_chunks for insert
  with check ((metadata->>'userId')::uuid = auth.uid());

create policy "Users can delete their own knowledge base chunks"
  on public.knowledge_base_chunks for delete
  using ((metadata->>'userId')::uuid = auth.uid());

-- Add trigger for updated_at
create trigger handle_updated_at before update on public.knowledge_base_chunks
  for each row execute function public.handle_updated_at(); 