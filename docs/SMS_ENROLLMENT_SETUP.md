# Customer SMS enrollment

Customer texts stay off until two things are true: `SMS_CONSENT_CONFIRMATION_ENABLED` is exactly `true` or `1`, and Supabase has acknowledged the consent row this code asks it to store. Credentials alone do not send a customer text.

This document is the setup for that store. Applying the SQL is a separate production change. This pull request does not merge, deploy, send a live SMS, change Twilio, or turn the flag on.

## What the flag covers

`SMS_CONSENT_CONFIRMATION_ENABLED` gates **customer** texts only:

| Path | Who receives it | Gate |
| --- | --- | --- |
| Enrollment confirmation after a checked consent box | Customer | Flag on, echoed consent id, atomic claim, effective consent still yes |
| Missed-call text-back (`/api/voice`) | Caller | Flag on and affirmative, not-stopped consent already stored for that phone |
| Review-request SMS (`/api/review-request`) | Customer | Admin key, Twilio credentials, flag on, and the same affirmative consent |

## What the flag does not cover

Owner alerts are a different send. Turning the enrollment flag off does not stop them, and turning it on does not make them customer consent texts.

| Path | Who receives it | Gate |
| --- | --- | --- |
| Speed-to-lead on `/api/estimate` | `TWILIO_TO_NUMBER` (owner) | All four Twilio vars: account SID, auth token, from-number, and `TWILIO_TO_NUMBER` |
| Missed-call alert on `/api/voice` | `TWILIO_TO_NUMBER` (owner) | The voice route's existing Twilio credential check. The call still forwards when the customer text is skipped |

A failed or unconfigured lead-ledger write does not queue the customer text. `recordLead` returns a consent id only when Supabase echoes the inserted row with `sms_consent` true. The enrollment sender then stores that id as consent evidence and sends only if `claim_sms_enrollment_send` returns `claimed: true` for it. The form and the customer email still succeed when storage fails.

## Behavior

- The form and the customer confirmation email still succeed when consent storage fails. The customer text is skipped.
- A second submit for a phone that already has an accepted or in-flight enrollment does not send again. That decision is one database function, `claim_sms_enrollment_send`, not a check in the request after a send.
- A provider failure is stored as `failed`, not `accepted`. A later affirmative consent can claim again. An in-flight `claimed` row is not treated as delivered.
- `stopped = true` blocks missed-call and review-request sends. Evidence stored before STOP cannot clear it or win a customer send. A later affirmative consent can re-enroll only when its `consented_at` is after `sms_phone_state.stopped_at`. A stopped row with no `stopped_at` stays stopped. This repo does not add an inbound Twilio webhook; the STOP writer must set both `stopped` and `stopped_at`.

## One-time SQL

Run this in the Supabase SQL editor before setting the flag. The service-role key is already the writer for the lead ledger. It bypasses RLS. Do not expose it as `NEXT_PUBLIC_`.

```sql
create table if not exists public.sms_consent_evidence (
  id uuid primary key default gen_random_uuid(),
  phone_e164 text not null,
  consent boolean not null,
  text_version text not null,
  consent_text text not null,
  consented_at timestamptz not null,
  page_url text,
  client_ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.sms_phone_state (
  phone_e164 text primary key,
  consent boolean not null,
  stopped boolean not null default false,
  -- Set this to the STOP event time when recording STOP. A stopped row
  -- with a null stopped_at cannot be cleared by claim_sms_enrollment_send.
  stopped_at timestamptz,
  text_version text,
  evidence_id uuid,
  send_status text not null default 'unsent',
  claimed_evidence_id uuid,
  provider_sid text,
  updated_at timestamptz not null default now(),
  constraint sms_phone_state_send_status_chk
    check (send_status in ('unsent', 'claimed', 'accepted', 'failed'))
);

alter table public.sms_consent_evidence enable row level security;
alter table public.sms_phone_state enable row level security;

create or replace function public.claim_sms_enrollment_send(
  p_phone text,
  p_evidence_id uuid,
  p_text_version text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  ev public.sms_consent_evidence%rowtype;
  st public.sms_phone_state%rowtype;
begin
  select * into ev
  from public.sms_consent_evidence
  where id = p_evidence_id;

  if not found
     or ev.phone_e164 is distinct from p_phone
     or ev.consent is not true
     or ev.text_version is distinct from p_text_version then
    return jsonb_build_object('claimed', false, 'reason', 'no_evidence');
  end if;

  select * into st
  from public.sms_phone_state
  where phone_e164 = p_phone
  for update;

  if not found then
    begin
      insert into public.sms_phone_state (
        phone_e164, consent, stopped, text_version, evidence_id,
        send_status, claimed_evidence_id, updated_at
      ) values (
        p_phone, true, false, p_text_version, p_evidence_id,
        'claimed', p_evidence_id, now()
      );
      return jsonb_build_object(
        'claimed', true,
        'reason', 'claimed',
        'evidence_id', p_evidence_id
      );
    exception
      when unique_violation then
        select * into st
        from public.sms_phone_state
        where phone_e164 = p_phone
        for update;
    end;
  end if;

  if st.phone_e164 is null then
    return jsonb_build_object('claimed', false, 'reason', 'replay');
  end if;

  -- STOP fails closed. Evidence stored before STOP, or a STOP with no
  -- stopped_at, must not clear the flag or win a send. Only evidence
  -- strictly newer than stopped_at is an ordered re-enrollment.
  if st.stopped is true
     and not (st.stopped_at is not null and ev.consented_at > st.stopped_at) then
    return jsonb_build_object('claimed', false, 'reason', 'stopped');
  end if;

  if st.stopped is not true and st.send_status in ('claimed', 'accepted') then
    return jsonb_build_object('claimed', false, 'reason', 'replay');
  end if;

  update public.sms_phone_state
  set consent = true,
      stopped = false,
      stopped_at = null,
      text_version = p_text_version,
      evidence_id = p_evidence_id,
      send_status = 'claimed',
      claimed_evidence_id = p_evidence_id,
      provider_sid = null,
      updated_at = now()
  where phone_e164 = p_phone
    and send_status is distinct from 'claimed'
    and (
      (
        stopped is true
        and stopped_at is not null
        and ev.consented_at > stopped_at
      )
      or (
        stopped is not true
        and (send_status in ('unsent', 'failed') or consent is not true)
      )
    )
  returning * into st;

  if not found then
    return jsonb_build_object('claimed', false, 'reason', 'replay');
  end if;

  return jsonb_build_object(
    'claimed', true,
    'reason', 'claimed',
    'evidence_id', p_evidence_id
  );
end;
$$;

revoke all on function public.claim_sms_enrollment_send(text, uuid, text) from public;
grant execute on function public.claim_sms_enrollment_send(text, uuid, text) to service_role;
```

The app reads a send as allowed only when this function returns `claimed: true` and `reason: "claimed"` for the same evidence id. Any other body skips the text.
