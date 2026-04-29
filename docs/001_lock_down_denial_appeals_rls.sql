-- Lock down direct public access to stored appeal records.
-- Run this in the Supabase SQL editor before using a public deployment.
--
-- Current MVP intent:
-- - Browsers should not read, insert, update, or delete denial_appeals directly
--   with the public anon key.
-- - Server-side API routes may still use the service-role key for controlled
--   MVP operations.
-- - Add user-scoped authenticated policies later when Supabase Auth is added.

alter table if exists public.denial_appeals enable row level security;
alter table if exists public.denial_appeals force row level security;

revoke all on table public.denial_appeals from anon;
revoke all on table public.denial_appeals from authenticated;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'denial_appeals'
  loop
    execute format(
      'drop policy if exists %I on public.denial_appeals',
      policy_record.policyname
    );
  end loop;
end $$;

