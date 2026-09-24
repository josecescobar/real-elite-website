-- Grokbot sales-ops tables (Supabase / Postgres).
-- Run once in the SQL editor. Uses the same SUPABASE_URL +
-- SUPABASE_SERVICE_ROLE_KEY already documented for the marketing lead ledger.
-- Does NOT alter public.leads (the existing append-only website ledger).

create table if not exists public.sales_customers (
  id            uuid primary key,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  full_name     text not null,
  email         text,
  phone         text,
  zip           text,
  city          text,
  state         text,
  source        text not null,
  external_ids  jsonb not null default '{}'::jsonb,
  notes         text
);

create table if not exists public.sales_leads (
  id                      uuid primary key,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  customer_id             uuid not null references public.sales_customers(id),
  conversation_id         uuid not null,
  source                  text not null,
  source_lead_id          text,
  status                  text not null,
  bucket                  text not null,
  project_type            text,
  project_summary         text,
  estimated_value_cents   integer,
  urgency                 text,
  zip                     text,
  city                    text,
  state                   text,
  score                   integer not null default 0,
  score_breakdown         jsonb,
  ai_mode                 text,
  ai_paused               boolean not null default false,
  assigned_to             text,
  escalation_reasons      jsonb not null default '[]'::jsonb,
  facts                   jsonb not null default '{}'::jsonb,
  draft_reply             text,
  draft_status            text,
  opportunity_id          uuid,
  raw                     jsonb
);

create unique index if not exists sales_leads_source_ext_idx
  on public.sales_leads (source, source_lead_id)
  where source_lead_id is not null;

create index if not exists sales_leads_bucket_idx on public.sales_leads (bucket, created_at desc);

create table if not exists public.sales_conversations (
  id           uuid primary key,
  lead_id      uuid not null,
  customer_id  uuid not null references public.sales_customers(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  facts        jsonb not null default '{}'::jsonb
);

create unique index if not exists sales_conversations_lead_idx
  on public.sales_conversations (lead_id);

create table if not exists public.sales_messages (
  id               uuid primary key,
  created_at       timestamptz not null default now(),
  conversation_id  uuid not null,
  lead_id          uuid not null,
  direction        text not null,
  channel          text not null,
  body             text not null,
  status           text not null,
  author           text,
  external_id      text,
  meta             jsonb
);

create index if not exists sales_messages_lead_idx on public.sales_messages (lead_id, created_at);

create table if not exists public.sales_webhook_events (
  id          uuid primary key,
  created_at  timestamptz not null default now(),
  connector   text not null,
  event_id    text not null,
  event_type  text not null,
  payload     jsonb not null,
  processed   boolean not null default false,
  lead_id     uuid,
  unique (connector, event_id)
);

create table if not exists public.sales_followups (
  id                uuid primary key,
  created_at        timestamptz not null default now(),
  lead_id           uuid not null,
  due_at            timestamptz not null,
  kind              text not null,
  status            text not null,
  note              text,
  cancelled_reason  text
);

create table if not exists public.sales_opportunities (
  id           uuid primary key,
  created_at   timestamptz not null default now(),
  lead_id      uuid not null,
  customer_id  uuid not null,
  title        text not null,
  value_cents  integer,
  stage        text not null
);

create table if not exists public.sales_estimate_drafts (
  id           uuid primary key,
  created_at   timestamptz not null default now(),
  lead_id      uuid not null,
  customer_id  uuid not null,
  title        text,
  line_items   jsonb not null default '[]'::jsonb,
  notes        text,
  status       text not null default 'draft',
  created_by   text
);

create table if not exists public.sales_agent_tasks (
  id                 uuid primary key,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  requesting_agent   text not null,
  instruction        text not null,
  context            jsonb,
  permissions        jsonb not null default '[]'::jsonb,
  status             text not null,
  result             jsonb,
  error              text
);

alter table public.sales_customers enable row level security;
alter table public.sales_leads enable row level security;
alter table public.sales_conversations enable row level security;
alter table public.sales_messages enable row level security;
alter table public.sales_webhook_events enable row level security;
alter table public.sales_followups enable row level security;
alter table public.sales_opportunities enable row level security;
alter table public.sales_estimate_drafts enable row level security;
alter table public.sales_agent_tasks enable row level security;
-- Service-role key bypasses RLS. No public policies on purpose.
