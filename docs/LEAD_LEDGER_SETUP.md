# Lead Ledger Setup (Supabase)

The site emails and texts every lead the moment it lands — that's the delivery path and it works on
its own. The **lead ledger** adds a durable, queryable record of every submission so lead volume,
source, and mix can be counted instead of hand-tallied from an inbox. It's the data behind the
weekly scoreboard (`docs/MILLION-DOLLAR-WEBSITE-PLAN.md` Part 4).

**It's optional and fully gated.** With the two env vars below unset, the ledger is a silent no-op —
nothing changes, leads still email/text exactly as before. Turning it on is a one-time, ~15-minute
setup.

## What it does

On every successful `/api/estimate` submission (which covers all three intakes — standard estimate,
instant roof quote, luxury consultation), the app inserts one row into a Supabase `leads` table.
The insert runs **after** the owner email is sent and the SMS is dispatched, never throws, and times
out fast — so a database hiccup can never block or delay a lead. Code: `src/lib/leads.ts`.

## One-time setup

1. **Create a Supabase project** (free tier is plenty) at https://supabase.com → New Project.

2. **Create the table.** In the Supabase dashboard → SQL Editor, run:

   ```sql
   create table if not exists public.leads (
     id            uuid primary key,
     ts            timestamptz not null,
     lead_type     text not null,          -- estimate | roof_quote | luxury_consultation
     luxury        boolean not null default false,
     full_name     text not null,
     email         text not null,
     phone         text not null,
     service       text not null,
     zip           text,
     budget_range  text,
     timeline      text,
     property_type text,
     message       text,
     utm_source    text,
     utm_medium    text,
     utm_campaign  text,
     referrer      text,
     landing_path  text
   );

   -- The app writes with the service-role key (server-only), which bypasses RLS.
   -- Enable RLS with no public policies so nothing else can read the table.
   alter table public.leads enable row level security;

   create index if not exists leads_ts_idx on public.leads (ts desc);
   create index if not exists leads_source_idx on public.leads (utm_source);
   ```

3. **Grab the two credentials** from Supabase → Project Settings:
   - **Project URL** → `SUPABASE_URL` (e.g. `https://abcdefgh.supabase.co`)
   - **API → `service_role` secret** → `SUPABASE_SERVICE_ROLE_KEY`
     ⚠️ The service-role key bypasses row-level security. It is **server-only** — it is read only in
     `src/lib/leads.ts` (an API route), never in a client component. Never expose it with a
     `NEXT_PUBLIC_` name.

4. **Set both in Vercel** → Settings → Environment Variables (Production + Preview), then redeploy.

## Verify

Submit a test estimate on the live site, then in Supabase → Table Editor → `leads`, confirm a new
row with the right `service`, `lead_type`, and (if you clicked in with a `?utm_source=...` link) the
attribution columns filled in.

## Querying the scoreboard

```sql
-- Leads per week
select date_trunc('week', ts) as week, count(*) from public.leads group by 1 order by 1 desc;

-- Leads by source (which channel is working)
select coalesce(utm_source, referrer, '(direct)') as source, count(*)
from public.leads group by 1 order by 2 desc;

-- Luxury pipeline
select ts, service, budget_range, full_name from public.leads where luxury order by ts desc;
```

## Premium campaign operations

The optional migration at `docs/sql/premium-campaign-lead-fields.sql` adds manual qualification,
contact, walkthrough, proposal, and outcome fields plus the weekly query for the
`premium_market_90_day` campaign. It does not change lead delivery or expose the table publicly.
Run it only after the base `leads` table above exists.
