-- Restrict all existing private Cosmo core tables to authenticated owner-scoped access.
-- Preserve append-only records by withholding UPDATE/DELETE grants where not needed.
revoke all on table public.cosmo_profiles, public.cosmo_missions, public.cosmo_knowledge_records, public.cosmo_memory_links, public.cosmo_conversations, public.cosmo_messages, public.cosmo_training_lessons, public.cosmo_training_evaluations, public.cosmo_audit_events from anon, public, authenticated;

grant select, insert, update on public.cosmo_profiles to authenticated;
grant select, insert, update on public.cosmo_missions to authenticated;
grant select, insert on public.cosmo_knowledge_records to authenticated;
grant select, insert on public.cosmo_memory_links to authenticated;
grant select, insert, update on public.cosmo_conversations to authenticated;
grant select, insert on public.cosmo_messages to authenticated;
grant select, insert, update on public.cosmo_training_lessons to authenticated;
grant select, insert on public.cosmo_training_evaluations to authenticated;
grant select, insert on public.cosmo_audit_events to authenticated;

drop policy if exists "creator manages own conversations" on public.cosmo_conversations;
create policy "creator reads own conversations" on public.cosmo_conversations for select to authenticated using ((select auth.uid()) = owner_id);
create policy "creator creates own conversations" on public.cosmo_conversations for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "creator updates own conversations" on public.cosmo_conversations for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);

drop policy if exists "creator manages own missions" on public.cosmo_missions;
create policy "creator reads own missions" on public.cosmo_missions for select to authenticated using ((select auth.uid()) = owner_id);
create policy "creator creates own missions" on public.cosmo_missions for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "creator updates own missions" on public.cosmo_missions for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);

drop policy if exists "creator manages own training lessons" on public.cosmo_training_lessons;
create policy "creator reads own training lessons" on public.cosmo_training_lessons for select to authenticated using ((select auth.uid()) = owner_id);
create policy "creator creates own training lessons" on public.cosmo_training_lessons for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "creator updates own training lessons" on public.cosmo_training_lessons for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
