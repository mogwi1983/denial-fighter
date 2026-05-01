-- Associate saved appeals with Supabase Auth users (Week 3 MVP).
-- Run in the Supabase SQL editor after enabling Auth in the project.
--
-- API routes use the service role and enforce filters in application code.
-- You can add tighter RLS later if browsers ever query this table with anon/auth keys.

alter table if exists public.denial_appeals
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists denial_appeals_user_id_idx on public.denial_appeals (user_id);

comment on column public.denial_appeals.user_id is 'Owning Supabase Auth user; null for rows created before auth or anonymous saves.';
