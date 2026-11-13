-- Cosmo dual-vault foundation v1.
-- Additive only: existing cosmo_knowledge_records and cosmo_memory_links remain untouched.
-- Authenticated users can SELECT/INSERT their own rows; updates and client deletes are withheld.
-- Account deletion intentionally cascades to a user's vault data for privacy erasure.

begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create sequence private.cosmo_history_code_seq as bigint start with 1 increment by 1 no cycle;
create sequence private.cosmo_memory_code_seq as bigint start with 1 increment by 1 no cycle;
revoke all on sequence private.cosmo_history_code_seq, private.cosmo_memory_code_seq from public, anon, authenticated;
grant usage on sequence private.cosmo_history_code_seq, private.cosmo_memory_code_seq to authenticated;

create table public.cosmo_history_records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  source_code text not null default '' check (length(btrim(source_code)) > 0),
  source_type text not null check (source_type in (
    'conversation', 'document', 'voice_note', 'file', 'external_source',
    'system_event', 'model_output', 'research_note'
  )),
  original_content text not null check (length(original_content) > 0),
  original_timestamp timestamptz,
  captured_at timestamptz not null default clock_timestamp(),
  provenance text not null check (provenance in (
    'creator_provided', 'user_provided', 'primary_source', 'external_source',
    'inference', 'speculation', 'system_generated', 'conversation'
  )),
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'verified', 'disputed')),
  source_reference text,
  supersedes_record_id uuid,
  source_hash text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid default auth.uid(),
  constraint cosmo_history_records_source_code_unique unique (source_code),
  constraint cosmo_history_records_owner_id_unique unique (owner_id, id),
  constraint cosmo_history_records_hash_format check (source_hash ~ '^[0-9a-f]{64}$'),
  constraint cosmo_history_records_external_reference check (
    source_type <> 'external_source' or
    (source_reference is not null and length(btrim(source_reference)) > 0)
  ),
  constraint cosmo_history_records_created_by_owner check (created_by is null or created_by = owner_id),
  constraint cosmo_history_records_not_self_supersede check (supersedes_record_id is null or supersedes_record_id <> id),
  constraint cosmo_history_records_supersedes_fk
    foreign key (owner_id, supersedes_record_id)
    references public.cosmo_history_records(owner_id, id)
    on delete cascade
);

create table public.cosmo_memory_index (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  memory_code text not null default '' check (length(btrim(memory_code)) > 0),
  version integer not null default 1 check (version > 0),
  title text not null check (length(btrim(title)) > 0),
  summary text not null check (length(btrim(summary)) > 0),
  project_codes text[] not null default '{}'::text[],
  tags text[] not null default '{}'::text[],
  retention_policy text not null default 'permanent'
    check (retention_policy in ('permanent', 'review_required', 'time_limited')),
  access_scope text not null default 'private' check (access_scope = 'private'),
  status text not null default 'active'
    check (status in ('active', 'superseded', 'disputed', 'withdrawn')),
  supersedes_memory_id uuid,
  memory_hash text not null default '',
  created_at timestamptz not null default clock_timestamp(),
  created_by uuid default auth.uid(),
  constraint cosmo_memory_index_code_version_unique unique (memory_code, version),
  constraint cosmo_memory_index_owner_id_unique unique (owner_id, id),
  constraint cosmo_memory_index_hash_format check (memory_hash ~ '^[0-9a-f]{64}$'),
  constraint cosmo_memory_index_created_by_owner check (created_by is null or created_by = owner_id),
  constraint cosmo_memory_index_not_self_supersede check (supersedes_memory_id is null or supersedes_memory_id <> id),
  constraint cosmo_memory_index_supersedes_fk
    foreign key (owner_id, supersedes_memory_id)
    references public.cosmo_memory_index(owner_id, id)
    on delete cascade
);

create table public.cosmo_memory_source_links (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  memory_index_id uuid not null,
  history_record_id uuid not null,
  relationship text not null default 'supported_by' check (length(btrim(relationship)) > 0),
  rationale text,
  created_at timestamptz not null default clock_timestamp(),
  constraint cosmo_memory_source_links_unique unique (owner_id, memory_index_id, history_record_id, relationship),
  constraint cosmo_memory_source_links_memory_fk
    foreign key (owner_id, memory_index_id)
    references public.cosmo_memory_index(owner_id, id)
    on delete cascade,
  constraint cosmo_memory_source_links_history_fk
    foreign key (owner_id, history_record_id)
    references public.cosmo_history_records(owner_id, id)
    on delete cascade
);

create index cosmo_history_records_owner_captured_idx
  on public.cosmo_history_records(owner_id, captured_at desc);
create index cosmo_history_records_owner_type_idx
  on public.cosmo_history_records(owner_id, source_type, captured_at desc);
create index cosmo_memory_index_owner_code_idx
  on public.cosmo_memory_index(owner_id, memory_code, version desc);
create index cosmo_memory_index_project_codes_idx
  on public.cosmo_memory_index using gin(project_codes);
create index cosmo_memory_source_links_owner_memory_idx
  on public.cosmo_memory_source_links(owner_id, memory_index_id);
create index cosmo_memory_source_links_owner_history_idx
  on public.cosmo_memory_source_links(owner_id, history_record_id);

create or replace function private.cosmo_assign_history_code()
returns trigger
language plpgsql
set search_path = pg_catalog
as $cosmo$
begin
  new.source_code := 'COSMO-HST-' || lpad(nextval('private.cosmo_history_code_seq')::text, 12, '0');
  return new;
end;
$cosmo$;

create or replace function private.cosmo_prepare_memory_index()
returns trigger
language plpgsql
set search_path = pg_catalog
as $cosmo$
declare
  prior_memory record;
begin
  if new.supersedes_memory_id is null then
    new.memory_code := 'COSMO-MEM-' || lpad(nextval('private.cosmo_memory_code_seq')::text, 12, '0');
    new.version := 1;
  else
    select memory_code, version
      into prior_memory
      from public.cosmo_memory_index
      where owner_id = new.owner_id and id = new.supersedes_memory_id;
    if not found then
      raise exception 'Superseded memory version was not found for this owner.';
    end if;
    new.memory_code := prior_memory.memory_code;
    new.version := prior_memory.version + 1;
  end if;
  return new;
end;
$cosmo$;

create or replace function private.cosmo_set_history_record_hash()
returns trigger
language plpgsql
set search_path = pg_catalog, extensions
as $cosmo$
begin
  new.source_hash := encode(
    extensions.digest(
      convert_to(
        jsonb_build_object(
          'id', new.id,
          'owner_id', new.owner_id,
          'created_by', new.created_by,
          'source_code', new.source_code,
          'source_type', new.source_type,
          'original_content', new.original_content,
          'original_timestamp_epoch', case when new.original_timestamp is null then null else extract(epoch from new.original_timestamp) end,
          'captured_at_epoch', extract(epoch from new.captured_at),
          'provenance', new.provenance,
          'verification_status', new.verification_status,
          'source_reference', new.source_reference,
          'supersedes_record_id', new.supersedes_record_id,
          'metadata', new.metadata
        )::text,
        'UTF8'
      ),
      'sha256'
    ),
    'hex'
  );
  return new;
end;
$cosmo$;

create or replace function private.cosmo_set_memory_index_hash()
returns trigger
language plpgsql
set search_path = pg_catalog, extensions
as $cosmo$
begin
  new.memory_hash := encode(
    extensions.digest(
      convert_to(
        jsonb_build_object(
          'id', new.id,
          'owner_id', new.owner_id,
          'created_by', new.created_by,
          'memory_code', new.memory_code,
          'version', new.version,
          'title', new.title,
          'summary', new.summary,
          'project_codes', new.project_codes,
          'tags', new.tags,
          'retention_policy', new.retention_policy,
          'access_scope', new.access_scope,
          'status', new.status,
          'supersedes_memory_id', new.supersedes_memory_id,
          'created_at_epoch', extract(epoch from new.created_at)
        )::text,
        'UTF8'
      ),
      'sha256'
    ),
    'hex'
  );
  return new;
end;
$cosmo$;

create or replace function private.cosmo_reject_vault_update()
returns trigger
language plpgsql
set search_path = pg_catalog
as $cosmo$
begin
  raise exception 'Cosmo vault records are append-only. Insert a new version or correction instead.';
end;
$cosmo$;

revoke all on function private.cosmo_assign_history_code() from public, anon, authenticated;
revoke all on function private.cosmo_prepare_memory_index() from public, anon, authenticated;
revoke all on function private.cosmo_set_history_record_hash() from public, anon, authenticated;
revoke all on function private.cosmo_set_memory_index_hash() from public, anon, authenticated;
revoke all on function private.cosmo_reject_vault_update() from public, anon, authenticated;
grant execute on function private.cosmo_assign_history_code() to authenticated;
grant execute on function private.cosmo_prepare_memory_index() to authenticated;
grant execute on function private.cosmo_set_history_record_hash() to authenticated;
grant execute on function private.cosmo_set_memory_index_hash() to authenticated;
grant execute on function private.cosmo_reject_vault_update() to authenticated;

create trigger cosmo_history_records_code_before_insert
before insert on public.cosmo_history_records
for each row execute function private.cosmo_assign_history_code();
create trigger cosmo_history_records_hash_before_insert
before insert on public.cosmo_history_records
for each row execute function private.cosmo_set_history_record_hash();
create trigger cosmo_memory_index_code_before_insert
before insert on public.cosmo_memory_index
for each row execute function private.cosmo_prepare_memory_index();
create trigger cosmo_memory_index_hash_before_insert
before insert on public.cosmo_memory_index
for each row execute function private.cosmo_set_memory_index_hash();

create trigger cosmo_history_records_no_update
before update on public.cosmo_history_records
for each row execute function private.cosmo_reject_vault_update();
create trigger cosmo_memory_index_no_update
before update on public.cosmo_memory_index
for each row execute function private.cosmo_reject_vault_update();
create trigger cosmo_memory_source_links_no_update
before update on public.cosmo_memory_source_links
for each row execute function private.cosmo_reject_vault_update();

alter table public.cosmo_history_records enable row level security;
alter table public.cosmo_history_records force row level security;
alter table public.cosmo_memory_index enable row level security;
alter table public.cosmo_memory_index force row level security;
alter table public.cosmo_memory_source_links enable row level security;
alter table public.cosmo_memory_source_links force row level security;

create policy "creator reads own history records"
  on public.cosmo_history_records for select to authenticated
  using ((select auth.uid()) = owner_id);
create policy "creator inserts own history records"
  on public.cosmo_history_records for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "creator reads own memory index"
  on public.cosmo_memory_index for select to authenticated
  using ((select auth.uid()) = owner_id);
create policy "creator inserts own memory index"
  on public.cosmo_memory_index for insert to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "creator reads own memory source links"
  on public.cosmo_memory_source_links for select to authenticated
  using ((select auth.uid()) = owner_id);
create policy "creator inserts own memory source links"
  on public.cosmo_memory_source_links for insert to authenticated
  with check ((select auth.uid()) = owner_id);

revoke all on table public.cosmo_history_records, public.cosmo_memory_index, public.cosmo_memory_source_links
  from public, anon, authenticated;
grant select, insert on table public.cosmo_history_records, public.cosmo_memory_index, public.cosmo_memory_source_links
  to authenticated;

commit;
