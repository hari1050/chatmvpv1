-- Add website column to users table
alter table public.users 
add column if not exists website text;
