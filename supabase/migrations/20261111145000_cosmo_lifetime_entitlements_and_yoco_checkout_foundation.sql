alter table public.cosmo_subscription_products
  add column if not exists lifetime_price_cents integer,
  add column if not exists lifetime_pricing_approved boolean not null default false;

alter table public.cosmo_subscription_tools
  add column if not exists lifetime_price_cents integer,
  add column if not exists lifetime_pricing_approved boolean not null default false;

create table if not exists public.cosmo_package_entitlements (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.cosmo_subscription_products(id) on delete restrict,
  source_invoice_id uuid not null references public.cosmo_invoices(id) on delete restrict,
  entitlement_code text not null unique,
  status text not null default 'active' check (status in ('active','revoked','refunded')),
  granted_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(owner_id, product_id),
  unique(source_invoice_id)
);

create table if not exists public.cosmo_tool_entitlements (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  tool_id uuid not null references public.cosmo_subscription_tools(id) on delete restrict,
  source_invoice_id uuid not null references public.cosmo_invoices(id) on delete restrict,
  package_entitlement_id uuid references public.cosmo_package_entitlements(id) on delete restrict,
  status text not null default 'active' check (status in ('active','revoked','refunded')),
  granted_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(owner_id, tool_id, source_invoice_id)
);

create table if not exists public.cosmo_yoco_checkouts (
  id uuid primary key default gen_random_uuid(),
  checkout_id text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.cosmo_subscription_products(id) on delete restrict,
  invoice_id uuid not null unique references public.cosmo_invoices(id) on delete restrict,
  tool_ids uuid[] not null default '{}',
  amount_cents integer not null check (amount_cents >= 200),
  currency text not null default 'ZAR' check (currency='ZAR'),
  status text not null default 'pending' check (status in ('pending','paid','failed','cancelled','refunded')),
  provider_event_id text unique,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists cosmo_package_entitlements_owner_idx on public.cosmo_package_entitlements(owner_id,status);
create index if not exists cosmo_tool_entitlements_owner_idx on public.cosmo_tool_entitlements(owner_id,status);
create index if not exists cosmo_yoco_checkouts_owner_idx on public.cosmo_yoco_checkouts(owner_id,created_at desc);

alter table public.cosmo_package_entitlements enable row level security;
alter table public.cosmo_tool_entitlements enable row level security;
alter table public.cosmo_yoco_checkouts enable row level security;

drop policy if exists cosmo_package_entitlements_owner_read on public.cosmo_package_entitlements;
create policy cosmo_package_entitlements_owner_read on public.cosmo_package_entitlements for select to authenticated using (auth.uid()=owner_id);
drop policy if exists cosmo_tool_entitlements_owner_read on public.cosmo_tool_entitlements;
create policy cosmo_tool_entitlements_owner_read on public.cosmo_tool_entitlements for select to authenticated using (auth.uid()=owner_id);
drop policy if exists cosmo_yoco_checkouts_deny_client_access on public.cosmo_yoco_checkouts;
create policy cosmo_yoco_checkouts_deny_client_access on public.cosmo_yoco_checkouts for all to anon,authenticated using(false) with check(false);

grant select on public.cosmo_package_entitlements to authenticated;
grant select on public.cosmo_tool_entitlements to authenticated;
