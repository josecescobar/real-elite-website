-- Optional operating fields for the 90-day premium campaign.
-- Run in the same Supabase project used by the lead ledger.

alter table public.leads
  add column if not exists lead_status text not null default 'new',
  add column if not exists qualification_score smallint,
  add column if not exists first_contact_at timestamptz,
  add column if not exists walkthrough_at timestamptz,
  add column if not exists proposal_at timestamptz,
  add column if not exists won_at timestamptz,
  add column if not exists lost_reason text;

alter table public.leads
  drop constraint if exists leads_lead_status_check;

alter table public.leads
  add constraint leads_lead_status_check
  check (lead_status in ('new', 'qualified', 'nurture', 'no_fit', 'walkthrough', 'proposal', 'won', 'lost'));

alter table public.leads
  drop constraint if exists leads_qualification_score_check;

alter table public.leads
  add constraint leads_qualification_score_check
  check (qualification_score is null or qualification_score between 0 and 10);

create index if not exists leads_campaign_idx
  on public.leads (utm_campaign, ts desc);

create index if not exists leads_status_idx
  on public.leads (lead_status, ts desc);

-- Weekly premium-campaign scorecard.
select
  date_trunc('week', ts) as week,
  count(*) as submissions,
  count(*) filter (where lead_status in ('qualified', 'walkthrough', 'proposal', 'won')) as qualified,
  count(*) filter (where first_contact_at <= ts + interval '4 hours') as contacted_within_4_hours,
  count(*) filter (where walkthrough_at is not null) as walkthroughs,
  count(*) filter (where proposal_at is not null) as proposals,
  count(*) filter (where won_at is not null) as wins
from public.leads
where utm_campaign = 'premium_market_90_day'
group by 1
order by 1 desc;

