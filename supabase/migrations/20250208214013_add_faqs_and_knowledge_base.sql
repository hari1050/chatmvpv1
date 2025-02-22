-- Enable pgvector extension
create extension if not exists vector;

-- Create knowledge_base table for storing file metadata
create table if not exists public.knowledge_base (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  file_name text not null,
  file_type text not null,
  file_path text not null,
  file_size bigint not null,
  processed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create knowledge_embeddings table for vector search
create table if not exists public.knowledge_embeddings (
  id bigserial primary key,
  content text not null,
  metadata jsonb,
  embedding vector(1536)
);

-- Create function to match documents
create or replace function match_documents(
  query_embedding vector(1536),
  match_count int DEFAULT 5,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (embedding <=> query_embedding) as similarity
  from knowledge_embeddings
  where metadata @> filter
  order by embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create faqs table
create table if not exists public.faqs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  question text not null,
  answer text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS for new tables
alter table public.knowledge_base enable row level security;
alter table public.knowledge_embeddings enable row level security;
alter table public.faqs enable row level security;

-- Create RLS policies for knowledge_base
create policy "Users can view their own knowledge base files"
  on public.knowledge_base for select
  using (auth.uid() = user_id);

create policy "Users can insert their own knowledge base files"
  on public.knowledge_base for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own knowledge base files"
  on public.knowledge_base for update
  using (auth.uid() = user_id);

create policy "Users can delete their own knowledge base files"
  on public.knowledge_base for delete
  using (auth.uid() = user_id);

-- Create RLS policies for knowledge_embeddings
create policy "Users can view their own embeddings"
  on public.knowledge_embeddings for select
  using ((metadata->>'userId')::uuid = auth.uid());

create policy "Users can insert their own embeddings"
  on public.knowledge_embeddings for insert
  with check ((metadata->>'userId')::uuid = auth.uid());

create policy "Users can update their own embeddings"
  on public.knowledge_embeddings for update
  using ((metadata->>'userId')::uuid = auth.uid());

create policy "Users can delete their own embeddings"
  on public.knowledge_embeddings for delete
  using ((metadata->>'userId')::uuid = auth.uid());

-- Create RLS policies for faqs
create policy "Users can view their own FAQs"
  on public.faqs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own FAQs"
  on public.faqs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own FAQs"
  on public.faqs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own FAQs"
  on public.faqs for delete
  using (auth.uid() = user_id);

-- Add triggers for updated_at
create trigger handle_updated_at
  before update on public.knowledge_base
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.faqs
  for each row
  execute function public.handle_updated_at();

-- Add storage bucket for knowledge base files
insert into storage.buckets (id, name, public)
values ('knowledge_base', 'knowledge_base', false);

-- Add storage policy for knowledge base files
create policy "Users can upload their own knowledge base files"
  on storage.objects for insert
  with check (
    bucket_id = 'knowledge_base' and
    auth.uid() = owner
  );

create policy "Users can update their own knowledge base files"
  on storage.objects for update
  using (
    bucket_id = 'knowledge_base' and
    auth.uid() = owner
  );

create policy "Users can delete their own knowledge base files"
  on storage.objects for delete
  using (
    bucket_id = 'knowledge_base' and
    auth.uid() = owner
  );

create policy "Users can read their own knowledge base files"
  on storage.objects for select
  using (
    bucket_id = 'knowledge_base' and
    auth.uid() = owner
  ); 