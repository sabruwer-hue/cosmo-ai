-- Cosmo Vault Integrity Guardian v1
-- Adds retrieval-time recomputation of the exact per-record SHA-256 payloads.
-- SECURITY INVOKER: RLS remains in force; callers can audit only rows they can read.
-- This detects altered rows, but cannot detect rows deleted before the audit unless
-- compared with an independently retained external checkpoint/manifest.

begin;

create or replace function public.cosmo_audit_vault_integrity()
returns table (
  record_type text,
  record_id uuid,
  record_code text,
  stored_hash text,
  calculated_hash text,
  integrity_status text
)
language sql
stable
security invoker
set search_path = pg_catalog, extensions
as $cosmo$
  with history_hashes as (
    select
      'history'::text as record_type,
      h.id as record_id,
      h.source_code as record_code,
      h.source_hash as stored_hash,
      encode(
        extensions.digest(
          convert_to(
            jsonb_build_object(
              'id', h.id,
              'owner_id', h.owner_id,
              'created_by', h.created_by,
              'source_code', h.source_code,
              'source_type', h.source_type,
              'original_content', h.original_content,
              'original_timestamp_epoch', case when h.original_timestamp is null then null else extract(epoch from h.original_timestamp) end,
              'captured_at_epoch', extract(epoch from h.captured_at),
              'provenance', h.provenance,
              'verification_status', h.verification_status,
              'source_reference', h.source_reference,
              'supersedes_record_id', h.supersedes_record_id,
              'metadata', h.metadata
            )::text,
            'UTF8'
          ),
          'sha256'
        ),
        'hex'
      ) as calculated_hash
    from public.cosmo_history_records h
  ),
  memory_hashes as (
    select
      'memory'::text as record_type,
      m.id as record_id,
      m.memory_code as record_code,
      m.memory_hash as stored_hash,
      encode(
        extensions.digest(
          convert_to(
            jsonb_build_object(
              'id', m.id,
              'owner_id', m.owner_id,
              'created_by', m.created_by,
              'memory_code', m.memory_code,
              'version', m.version,
              'title', m.title,
              'summary', m.summary,
              'project_codes', m.project_codes,
              'tags', m.tags,
              'retention_policy', m.retention_policy,
              'access_scope', m.access_scope,
              'status', m.status,
              'supersedes_memory_id', m.supersedes_memory_id,
              'created_at_epoch', extract(epoch from m.created_at)
            )::text,
            'UTF8'
          ),
          'sha256'
        ),
        'hex'
      ) as calculated_hash
    from public.cosmo_memory_index m
  ),
  all_hashes as (
    select * from history_hashes
    union all
    select * from memory_hashes
  )
  select
    a.record_type,
    a.record_id,
    a.record_code,
    a.stored_hash,
    a.calculated_hash,
    case
      when a.stored_hash = a.calculated_hash then 'valid'
      else 'mismatch'
    end as integrity_status
  from all_hashes a
  where a.stored_hash is distinct from a.calculated_hash;
$cosmo$;

revoke all on function public.cosmo_audit_vault_integrity() from public, anon;
grant execute on function public.cosmo_audit_vault_integrity() to authenticated;

comment on function public.cosmo_audit_vault_integrity() is
  'Recomputes SHA-256 hashes for the calling authenticated user''s visible Cosmo history and memory records. Returns mismatches only. Does not detect missing/deleted rows; compare against an independently retained checkpoint for deletion detection.';

commit;
