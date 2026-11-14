-- Run only after the dual-vault migration has been applied to a disposable test database.
-- Uses pgTAP if available; the enclosing transaction rolls back the extension creation and test setup.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(48);

select has_table('public', 'cosmo_history_records', 'history archive table exists');
select has_table('public', 'cosmo_memory_index', 'memory index table exists');
select has_table('public', 'cosmo_memory_source_links', 'memory-source link table exists');

select ok((select relrowsecurity from pg_class where oid = 'public.cosmo_history_records'::regclass), 'history RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.cosmo_memory_index'::regclass), 'memory index RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.cosmo_memory_source_links'::regclass), 'source-link RLS enabled');

select ok((select relforcerowsecurity from pg_class where oid = 'public.cosmo_history_records'::regclass), 'history FORCE RLS enabled');
select ok((select relforcerowsecurity from pg_class where oid = 'public.cosmo_memory_index'::regclass), 'memory index FORCE RLS enabled');
select ok((select relforcerowsecurity from pg_class where oid = 'public.cosmo_memory_source_links'::regclass), 'source-link FORCE RLS enabled');

select ok(has_table_privilege('authenticated', 'public.cosmo_history_records', 'SELECT'), 'authenticated can read own history through RLS');
select ok(has_table_privilege('authenticated', 'public.cosmo_memory_index', 'SELECT'), 'authenticated can read own memory through RLS');
select ok(has_table_privilege('authenticated', 'public.cosmo_memory_source_links', 'SELECT'), 'authenticated can read own links through RLS');

select ok(has_table_privilege('authenticated', 'public.cosmo_history_records', 'INSERT'), 'authenticated can insert history');
select ok(has_table_privilege('authenticated', 'public.cosmo_memory_index', 'INSERT'), 'authenticated can insert memory versions');
select ok(has_table_privilege('authenticated', 'public.cosmo_memory_source_links', 'INSERT'), 'authenticated can insert source links');

select ok(not has_table_privilege('authenticated', 'public.cosmo_history_records', 'UPDATE'), 'authenticated cannot update history');
select ok(not has_table_privilege('authenticated', 'public.cosmo_memory_index', 'UPDATE'), 'authenticated cannot update memory');
select ok(not has_table_privilege('authenticated', 'public.cosmo_memory_source_links', 'UPDATE'), 'authenticated cannot update links');

select ok(not has_table_privilege('authenticated', 'public.cosmo_history_records', 'DELETE'), 'authenticated cannot delete history');
select ok(not has_table_privilege('authenticated', 'public.cosmo_memory_index', 'DELETE'), 'authenticated cannot delete memory');
select ok(not has_table_privilege('authenticated', 'public.cosmo_memory_source_links', 'DELETE'), 'authenticated cannot delete links');

select ok(not has_table_privilege('anon', 'public.cosmo_history_records', 'SELECT'), 'anon cannot read history');
select ok(not has_table_privilege('anon', 'public.cosmo_memory_index', 'SELECT'), 'anon cannot read memory');
select ok(not has_table_privilege('anon', 'public.cosmo_memory_source_links', 'SELECT'), 'anon cannot read links');

select has_trigger('public', 'cosmo_history_records', 'cosmo_history_records_code_before_insert', 'history code generator trigger exists');
select has_trigger('public', 'cosmo_history_records', 'cosmo_history_records_hash_before_insert', 'history hash trigger exists');
select has_trigger('public', 'cosmo_memory_index', 'cosmo_memory_index_code_before_insert', 'memory code/version trigger exists');
select has_trigger('public', 'cosmo_memory_index', 'cosmo_memory_index_hash_before_insert', 'memory hash trigger exists');

select has_trigger('public', 'cosmo_history_records', 'cosmo_history_records_no_update', 'history update guard exists');
select has_trigger('public', 'cosmo_memory_index', 'cosmo_memory_index_no_update', 'memory update guard exists');
select has_trigger('public', 'cosmo_memory_source_links', 'cosmo_memory_source_links_no_update', 'source-link update guard exists');

select ok(has_sequence_privilege('authenticated', 'private.cosmo_history_code_seq', 'USAGE'), 'authenticated can allocate generated history codes');
select ok(has_sequence_privilege('authenticated', 'private.cosmo_memory_code_seq', 'USAGE'), 'authenticated can allocate generated memory codes');

select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cosmo_history_records' and policyname = 'creator reads own history records'), 'history owner read policy exists');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cosmo_history_records' and policyname = 'creator inserts own history records'), 'history owner insert policy exists');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cosmo_memory_index' and policyname = 'creator reads own memory index'), 'memory owner read policy exists');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cosmo_memory_index' and policyname = 'creator inserts own memory index'), 'memory owner insert policy exists');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cosmo_memory_source_links' and policyname = 'creator reads own memory source links'), 'source-link owner read policy exists');
select ok(exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'cosmo_memory_source_links' and policyname = 'creator inserts own memory source links'), 'source-link owner insert policy exists');

select ok(to_regprocedure('public.cosmo_audit_vault_integrity()') is not null, 'retrieval-time vault integrity audit function exists');
select ok(has_function_privilege('authenticated', 'public.cosmo_audit_vault_integrity()', 'EXECUTE'), 'authenticated users can run the RLS-scoped integrity audit');

select has_trigger('public', 'cosmo_history_records', 'cosmo_history_records_no_direct_delete', 'history direct-delete guard exists');
select has_trigger('public', 'cosmo_memory_index', 'cosmo_memory_index_no_direct_delete', 'memory direct-delete guard exists');
select has_trigger('public', 'cosmo_memory_source_links', 'cosmo_memory_source_links_no_direct_delete', 'source-link direct-delete guard exists');

select ok((select confdeltype = 'r' from pg_constraint where conname = 'cosmo_history_records_supersedes_fk'), 'history supersedes relationship restricts deletion');
select ok((select confdeltype = 'r' from pg_constraint where conname = 'cosmo_memory_index_supersedes_fk'), 'memory supersedes relationship restricts deletion');

select ok(to_regprocedure('public.cosmo_export_vault_checkpoint()') is not null, 'external checkpoint export function exists');
select ok(has_function_privilege('authenticated', 'public.cosmo_export_vault_checkpoint()', 'EXECUTE'), 'authenticated users can export their RLS-scoped checkpoint');

select * from finish();
rollback;
