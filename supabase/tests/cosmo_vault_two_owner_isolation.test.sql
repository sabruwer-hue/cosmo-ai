-- Two-owner vault isolation integration test.
-- Run only in a disposable Supabase/PostgreSQL database after applying all vault migrations.
-- Requires a privileged test connection to create isolated auth.users fixtures.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, pg_catalog;

select plan(8);

insert into auth.users (id, aud, role, email, encrypted_password)
values
  ('11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'vault-owner-a@example.invalid', ''),
  ('22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated', 'vault-owner-b@example.invalid', '')
on conflict (id) do nothing;

set local role authenticated;

-- Owner A creates a history record and memory, then links them.
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);

insert into public.cosmo_history_records (
  id, owner_id, source_type, original_content, provenance
) values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  '11111111-1111-4111-8111-111111111111',
  'conversation', 'Owner A source record', 'user_provided'
);

insert into public.cosmo_memory_index (
  id, owner_id, title, summary
) values (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  '11111111-1111-4111-8111-111111111111',
  'Owner A memory', 'Memory summary belonging only to owner A'
);

insert into public.cosmo_memory_source_links (
  owner_id, memory_index_id, history_record_id, relationship
) values (
  '11111111-1111-4111-8111-111111111111',
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'supported_by'
);

-- Owner B creates a separate record and memory.
select set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', true);
select set_config('request.jwt.claims', '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}', true);

insert into public.cosmo_history_records (
  id, owner_id, source_type, original_content, provenance
) values (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '22222222-2222-4222-8222-222222222222',
  'conversation', 'Owner B private source record', 'user_provided'
);

insert into public.cosmo_memory_index (
  id, owner_id, title, summary
) values (
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  '22222222-2222-4222-8222-222222222222',
  'Owner B private memory', 'Memory summary belonging only to owner B'
);

-- Switch back to A and prove that B's rows and checkpoint contents are invisible.
select set_config('request.jwt.claim.sub', '11111111-1111-4111-8111-111111111111', true);
select set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);

select is(
  (select count(*)::integer from public.cosmo_history_records),
  1,
  'Owner A sees exactly one history record'
);
select is(
  (select count(*)::integer from public.cosmo_memory_index),
  1,
  'Owner A sees exactly one memory record'
);
select is(
  (select count(*)::integer from public.cosmo_memory_source_links),
  1,
  'Owner A sees exactly one source link'
);
select is(
  (select count(*)::integer from public.cosmo_history_records where id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'),
  0,
  'Owner A cannot read Owner B history by known record ID'
);
select is(
  (select count(*)::integer from public.cosmo_memory_index where id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'),
  0,
  'Owner A cannot read Owner B memory by known record ID'
);
select is(
  (select checkpoint_payload->>'owner_id' from public.cosmo_export_vault_checkpoint()),
  '11111111-1111-4111-8111-111111111111',
  'Checkpoint is bound to the authenticated owner'
);
select ok(
  (select checkpoint_payload::text not like '%22222222-2222-4222-8222-222222222222%'
   from public.cosmo_export_vault_checkpoint()),
  'Owner A checkpoint contains no Owner B identifier'
);
select is(
  (select count(*)::integer from public.cosmo_audit_vault_integrity()),
  0,
  'Owner A integrity audit checks only visible records and reports no mismatches'
);

select * from finish();
rollback;
