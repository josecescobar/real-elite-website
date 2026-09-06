import type { StubConnector } from './types';

/**
 * Modular connectors that are not live. Interfaces + required env names
 * only — no fake credentials, no pretend sync.
 */
export const STUB_CONNECTORS: StubConnector[] = [
  {
    name: 'quickbooks',
    capabilities: ['create_estimate', 'create_invoice'],
    status: 'stub',
    notes:
      'QuickBooks Online estimate/invoice write. Wire after QBO app + company realm is approved. Estimate drafts stay in sales_estimate_drafts until then.',
    requiredEnv: ['QBO_CLIENT_ID', 'QBO_CLIENT_SECRET', 'QBO_REALM_ID', 'QBO_REFRESH_TOKEN'],
  },
  {
    name: 'calendar',
    capabilities: ['create_calendar_event'],
    status: 'stub',
    notes: 'Site-visit holds for Jose. Google Calendar or Microsoft 365 — not connected.',
    requiredEnv: ['GOOGLE_CALENDAR_ID', 'GOOGLE_CALENDAR_REFRESH_TOKEN'],
  },
  {
    name: 'gmail',
    capabilities: ['receive_messages', 'send_messages'],
    status: 'stub',
    notes: 'Inbound estimate@ / info@ mail as a second lead connector. Not connected.',
    requiredEnv: ['GMAIL_OAUTH_CLIENT_ID', 'GMAIL_OAUTH_CLIENT_SECRET', 'GMAIL_OAUTH_REFRESH_TOKEN'],
  },
  {
    name: 'twilio',
    capabilities: ['receive_messages', 'send_messages'],
    status: 'stub',
    notes:
      'Two-way SMS already exists for speed-to-lead / missed-call. Sales-ops does not send from those numbers yet.',
    requiredEnv: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM_NUMBER'],
  },
  {
    name: 'website',
    capabilities: ['ingest_leads'],
    status: 'stub',
    notes:
      'Website /api/estimate already emails + texts Jose and can write the marketing leads ledger. Not yet dual-written into sales-ops.',
    requiredEnv: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
  },
];
