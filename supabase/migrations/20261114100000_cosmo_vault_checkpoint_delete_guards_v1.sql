-- Cosmo Vault Checkpoint + Delete Guards v1
-- Exports a deterministic per-owner manifest for storage outside this database.
-- Adds direct-delete guards while preserving intentional account-erasure cascades.
-- This migration is additive except that supersedes FKs change from CASCADE to RESTRICT.

begin;

-- A correction/version must not disappear merely because an earlier version is deleted.
alter table public.cosmo_history_records
  drop constraint cosmo_history_records_supersedes_fk;
alter table public.cosmo_history_records
  add constraint cosmo_history_records_supersedes_fk
  foreign key (owner_id, supersedes_record_id)
  references public.cosmo_history_records(owner_id, id)
  on delete restrict;

alter table public.cosmo_memory_index
  drop constraint cosmo_memory_index_supersedes_fk;
alter table public.cosmo_memory_index
  add constraint cosmo_memory_index_supersedes_fk
  foreign key (owner_id, supersedes_memory_id)
  references public.cosmo_memory_index(owner_id, id)
  on delete restrict;

-- Direct DELETE is rejected. Nested FK cascades are allowed so that an intentional
-- auth.users account-erasure cascade can still remove that owner's vault data.
-- Cascades from superseded versions are separately prevented by the RESTRICT FKs above.
create or replace function private.cosmo_reject_direct_vault_delete()
returns trigger
language plpgsql
set search_path = pg_catalog
as $cosmo$
begin
  if pg_catalog.pg_trigger_depth() = 1 then
    raise exception 'Direct deletion from the Cosmo vault is blocked. Use a reviewed retention or account-erasure workflow.';
  end if;
  return old;
end;
$cosmo$;

revoke all on function private.cosmo_reject_direct_vault_delete() from public, anon, authenticated;
grant execute on function private.cosmo_reject_direct_vault_delete() to authenticated;

create trigger cosmo_history_records_no_direct_delete
before delete on public.cosmo_history_records
for each row execute function private.cosmo_reject_direct_vault_delete();

create trigger cosmo_memory_index_no_direct_delete
before delete on public.cosmo_memory_index
for each row execute function private.cosmo_reject_direct_vault_delete();

create trigger cosmo_memory_source_links_no_direct_delete
before delete on public.cosmo_memory_source_links
for each row execute function private.cosmo_reject_direct_vault_delete();

-- A deterministic manifest that can be exported to an independent, access-controlled
-- store. Store both payload and digest with an external timestamp/version. A manifest
-- kept only in this same database is NOT an independent deletion-proof checkpoint.
create or replace function public.cosmo_export_vault_checkpoint()
returns table (
  checkpoint_payload jsonb,
  checkpoint_sha256 text
)
language sql
stable
security invoker
set search_path = pg_catalog, extensions
as $cosmo$
  with payload as (
    select jsonb_build_object(
      'format', 'cosmo-vault-checkpoint-v1',
      'owner_id', auth.uid(),
      'exported_at', statement_timestamp(),
      'history_records', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'id', h.id,
            'code', h.source_code,
            'hash', h.source_hash
          ) order by h.source_code
        )
        from public.cosmo_history_records h
        where h.owner_id = auth.uid()
      ), '[]'::jsonb),
      'memory_records', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'id', m.id,
            'code', m.memory_code,
            'version', m.version,
            'hash', m.memory_hash
          ) order by m.memory_code, m.version
        )
        from public.cosmo_memory_index m
        where m.owner_id = auth.uid()
      ), '[]'::jsonb),
      'source_links', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'id', l.id,
            'memory_index_id', l.memory_index_id,
            'history_record_id', l.history_record_id,
            'relationship', l.relationship,
            'rationale', l.rationale,
            'created_at', l.created_at
          ) order by l.id
        )
        from public.cosmo_memory_source_links l
        where l.owner_id = auth.uid()
      ), '[]'::jsonb)
    ) as document
  )
  select
    p.document,
    encode(
      extensions.digest(convert_to(p.document::text, 'UTF8'), 'sha256'),
      'hex'
    )
  from payload p
  where auth.uid() is not null;
$cosmo$;

revoke all on function public.cosmo_export_vault_checkpoint() from public, anon;
grant execute on function public.cosmo_export_vault_checkpoint() to authenticated;

comment on function public.cosmo_export_vault_checkpoint() is
  'Exports a deterministic per-owner manifest and SHA-256 digest. Persist the payload and digest in a separate, access-controlled system with independent retention; a same-database copy cannot prove deletion resistance.';

comment on function private.cosmo_reject_direct_vault_delete() is
  'Rejects direct vault row deletion while permitting nested FK cascades used by intentional account erasure. Supersedes relationships use RESTRICT to prevent version-chain cascades.';

commit;
