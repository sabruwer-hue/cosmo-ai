-- Applied to Supabase project yevkzktlzxjrlvsxtnez on 2026-11-11.
-- Creator-owned package registry, task orchestration, append-only task events and approval records.
create table if not exists public.cosmo_packages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  package_code text not null,
  slug text not null,
  name text not null,
  description text not null default '',
  package_type text not null check (package_type in ('assistant','intelligence','learning','business','guardian','eartron','admin','developer')),
  version text not null default '0.1.0',
  status text not null default 'planned' check (status in ('planned','development','testing','active','paused','retired')),
  visibility text not null default 'private' check (visibility in ('private','public')),
  capabilities jsonb not null default '[]'::jsonb,
  permissions jsonb not null default '[]'::jsonb,
  platform_targets text[] not null default array['web','android']::text[],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, package_code),
  unique(owner_id, slug),
  unique(owner_id, id)
);
create table if not exists public.cosmo_package_releases (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  package_id uuid not null,
  release_code text not null,
  version text not null,
  build_number integer not null check (build_number > 0),
  release_channel text not null default 'internal' check (release_channel in ('internal','beta','stable')),
  status text not null default 'planned' check (status in ('planned','building','testing','approved','published','withdrawn')),
  artifact_url text,
  checksum_sha256 text,
  changelog text not null default '',
  min_api_version text,
  created_at timestamptz not null default now(),
  unique(owner_id, release_code),
  unique(owner_id, package_id, version),
  foreign key(owner_id, package_id) references public.cosmo_packages(owner_id, id) on delete restrict
);
create table if not exists public.cosmo_agent_tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  task_code text not null default ('COSMO-TASK-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))),
  title text not null,
  description text not null default '',
  task_type text not null default 'general' check (task_type in ('general','research','build','review','learning','business','maintenance','deployment')),
  status text not null default 'planned' check (status in ('backlog','planned','in_progress','blocked','awaiting_approval','completed','cancelled')),
  priority smallint not null default 3 check (priority between 1 and 5),
  due_at timestamptz,
  outcome text,
  approval_required boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(owner_id, task_code),
  unique(owner_id, id)
);
create table if not exists public.cosmo_task_steps (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null,
  step_code text not null default ('COSMO-STEP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))),
  title text not null,
  details text not null default '',
  status text not null default 'todo' check (status in ('todo','in_progress','blocked','completed','skipped')),
  step_order integer not null default 1 check (step_order > 0),
  result text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(owner_id, step_code),
  foreign key(owner_id, task_id) references public.cosmo_agent_tasks(owner_id, id) on delete restrict
);
create table if not exists public.cosmo_task_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null,
  event_code text not null default ('COSMO-EVT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))),
  event_type text not null,
  summary text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(owner_id, event_code),
  foreign key(owner_id, task_id) references public.cosmo_agent_tasks(owner_id, id) on delete restrict
);
create table if not exists public.cosmo_agent_approvals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null,
  approval_code text not null default ('COSMO-APR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))),
  action_summary text not null,
  risk_level text not null default 'medium' check (risk_level in ('low','medium','high','critical')),
  status text not null default 'pending' check (status in ('pending','approved','rejected','withdrawn')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decision_note text,
  metadata jsonb not null default '{}'::jsonb,
  unique(owner_id, approval_code),
  foreign key(owner_id, task_id) references public.cosmo_agent_tasks(owner_id, id) on delete restrict
);
create index if not exists cosmo_packages_owner_status_idx on public.cosmo_packages(owner_id, status);
create index if not exists cosmo_package_releases_package_idx on public.cosmo_package_releases(owner_id, package_id, created_at desc);
create index if not exists cosmo_agent_tasks_owner_status_idx on public.cosmo_agent_tasks(owner_id, status, priority, created_at desc);
create index if not exists cosmo_task_steps_task_order_idx on public.cosmo_task_steps(owner_id, task_id, step_order);
create index if not exists cosmo_task_events_task_time_idx on public.cosmo_task_events(owner_id, task_id, created_at desc);
create index if not exists cosmo_agent_approvals_status_idx on public.cosmo_agent_approvals(owner_id, status, requested_at desc);
alter table public.cosmo_packages enable row level security;
alter table public.cosmo_package_releases enable row level security;
alter table public.cosmo_agent_tasks enable row level security;
alter table public.cosmo_task_steps enable row level security;
alter table public.cosmo_task_events enable row level security;
alter table public.cosmo_agent_approvals enable row level security;
create policy "cosmo_packages_select_own" on public.cosmo_packages for select to authenticated using ((select auth.uid()) = owner_id);
create policy "cosmo_packages_insert_own" on public.cosmo_packages for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "cosmo_packages_update_own" on public.cosmo_packages for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "cosmo_package_releases_select_own" on public.cosmo_package_releases for select to authenticated using ((select auth.uid()) = owner_id);
create policy "cosmo_package_releases_insert_own" on public.cosmo_package_releases for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "cosmo_agent_tasks_select_own" on public.cosmo_agent_tasks for select to authenticated using ((select auth.uid()) = owner_id);
create policy "cosmo_agent_tasks_insert_own" on public.cosmo_agent_tasks for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "cosmo_agent_tasks_update_own" on public.cosmo_agent_tasks for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "cosmo_task_steps_select_own" on public.cosmo_task_steps for select to authenticated using ((select auth.uid()) = owner_id);
create policy "cosmo_task_steps_insert_own" on public.cosmo_task_steps for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "cosmo_task_steps_update_own" on public.cosmo_task_steps for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "cosmo_task_events_select_own" on public.cosmo_task_events for select to authenticated using ((select auth.uid()) = owner_id);
create policy "cosmo_task_events_insert_own" on public.cosmo_task_events for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "cosmo_agent_approvals_select_own" on public.cosmo_agent_approvals for select to authenticated using ((select auth.uid()) = owner_id);
create policy "cosmo_agent_approvals_insert_own" on public.cosmo_agent_approvals for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "cosmo_agent_approvals_update_own" on public.cosmo_agent_approvals for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
grant select, insert, update on public.cosmo_packages to authenticated;
grant select, insert on public.cosmo_package_releases to authenticated;
grant select, insert, update on public.cosmo_agent_tasks to authenticated;
grant select, insert, update on public.cosmo_task_steps to authenticated;
grant select, insert on public.cosmo_task_events to authenticated;
grant select, insert, update on public.cosmo_agent_approvals to authenticated;
comment on table public.cosmo_packages is 'Owner-controlled registry of independently installable Cosmo application packages.';
comment on table public.cosmo_agent_tasks is 'Persistent creator-owned work queue for Cosmo agent tasks; external actions still require explicit approval.';
comment on table public.cosmo_task_events is 'Append-only task event history for traceability.';
comment on table public.cosmo_agent_approvals is 'Explicit creator approval records for consequential agent actions.';
