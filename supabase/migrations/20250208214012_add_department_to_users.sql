-- Add department column to users table
alter table public.users 
add column if not exists department text; 