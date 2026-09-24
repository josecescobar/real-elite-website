# Grokbot sales ops — Jose handoff (A–G)

Grokbot is the first live sales agent on this site. Thumbtack is the first
connector. Default mode is **Safe Autopilot**: draft a PM-quality reply,
never auto-commit price / firm dates / permits / discounts / legal /
out-of-area coverage. Outbound Thumbtack send is stubbed until Partner
OAuth tokens exist — first deploy behaves as **Draft Only** for sending.

Related repos `josecescobar/titan-field-service` and
`josecescobar/uplinq-platform` were not present. This lives in
`real-elite-website` under `src/lib/sales` plus the routes below, reusing
the existing Next.js / Vercel / env-gated Supabase PostgREST pattern.

## A. Thumbtack webhook URL

Production (after this ships):

```
https://www.realelitecontracting.com/api/webhooks/thumbtack
```

Preview / this PR: `https://<vercel-preview-host>/api/webhooks/thumbtack`

Health: `GET /api/sales/health` and `GET /api/webhooks/thumbtack`

## B. Thumbtack events and auth

Documented Partner Platform v4 event types to subscribe:

| Event | Purpose |
|---|---|
| `NegotiationCreatedV4` | New lead (required) |
| `MessageCreatedV4` | Customer messages |
| `ReviewCreatedV4` | Reviews |

Also accepted if Thumbtack adds them later: `NegotiationUpdatedV4`,
`NegotiationStatusUpdatedV4`.

**Auth Thumbtack actually documents:** HTTP Basic on the webhook
(`THUMBTACK_WEBHOOK_USER` + `THUMBTACK_WEBHOOK_PASSWORD`).

There is no public “paste a URL in Thumbtack Pro settings” API. Partner
webhooks are created with OAuth:

`POST /api/v4/businesses/{{businessID}}/webhooks`

Until that access exists, Jose can still POST a simulated payload (or a
proxy) using optional `THUMBTACK_WEBHOOK_TOKEN` as
`Authorization: Bearer …` or `X-Webhook-Token`. If **no** Thumbtack auth
env vars are set, the receiver accepts posts so first-deploy simulate
works — set Basic or the token before going live.

## C. Env var names (never values)

Sales-ops (new):

- `SALES_AGENT_MODE`
- `GROKBOT_API_KEY`
- `SALES_FOLLOWUP_CADENCE`
- `THUMBTACK_WEBHOOK_USER`
- `THUMBTACK_WEBHOOK_PASSWORD`
- `THUMBTACK_WEBHOOK_TOKEN`
- `THUMBTACK_WEBHOOK_SECRET`
- `THUMBTACK_ACCESS_TOKEN`
- `THUMBTACK_BUSINESS_ID`
- `XAI_API_KEY`
- `OPENAI_API_KEY`

Already used (durable store + command center):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_TOOLS_KEY`

Stub connector names only (do not invent values): `QBO_CLIENT_ID`,
`QBO_CLIENT_SECRET`, `QBO_REALM_ID`, `QBO_REFRESH_TOKEN`,
`GOOGLE_CALENDAR_ID`, `GOOGLE_CALENDAR_REFRESH_TOKEN`,
`GMAIL_OAUTH_CLIENT_ID`, `GMAIL_OAUTH_CLIENT_SECRET`,
`GMAIL_OAUTH_REFRESH_TOKEN`.

## D. Deploy and health-check

1. Merge this PR — Vercel deploys the existing `real-elite-website` project.
2. `GET https://www.realelitecontracting.com/api/sales/health`
   Expect `ok: true`, `mode: safe_autopilot`, `store: memory|supabase`.
3. `GET https://www.realelitecontracting.com/api/webhooks/thumbtack`
   Expect `ok: true` and the accepted event list.
4. Command center (noindex): `/sales` — unlock with `ADMIN_TOOLS_KEY`.

## E. Simulated Thumbtack lead

```bash
curl -sS -X POST https://www.realelitecontracting.com/api/webhooks/thumbtack \
  -H 'content-type: application/json' \
  -d '{
    "eventID": "evt_sim_walkin_shower_001",
    "eventType": "NegotiationCreatedV4",
    "createdAt": "2026-09-06T13:00:00Z",
    "data": {
      "negotiationID": "neg_sim_25401_bath",
      "customer": { "name": "Jane Homeowner", "phone": "6815550142", "email": "jane@example.com" },
      "request": {
        "category": "Bathroom Remodel",
        "description": "Need a walk-in shower in the hall bath. Tile is cracked and the pan leaks.",
        "location": { "zipCode": "25401", "city": "Martinsburg", "state": "WV" }
      },
      "estimatedValue": 12000,
      "urgency": "this month"
    }
  }'
```

The JSON response includes the stored `lead` (score, facts, bucket) and
`draftReply`. Repeat the same `eventID` — `duplicate: true`, no second lead.

Durable rows require running `docs/sql/sales-ops.sql` in Supabase. Without
that, the same serverless instance still returns the stored lead + draft
in the webhook response (process memory).

## F. ChatGPT ↔ Grokbot bridge

```
POST /api/agents/grokbot/tasks
Authorization: Bearer $GROKBOT_API_KEY
```

Body:

```json
{
  "taskId": "optional-uuid",
  "requestingAgent": "chatgpt",
  "instruction": "Draft a reply for this Thumbtack bathroom lead",
  "context": { "leadId": "<id>" },
  "permissions": ["leads:read", "leads:draft"],
  "createdAt": "2026-09-06T13:05:00Z"
}
```

Status: `GET /api/agents/grokbot/tasks/{taskId}`

Tool catalog: `GET /api/agents/grokbot/tools` or
`GET /api/agents/grokbot/tasks?tools=1`

ChatGPT custom-action / function definitions:

```json
{
  "openapi": "3.1.0",
  "info": { "title": "Grokbot Sales", "version": "1.0.0" },
  "servers": [{ "url": "https://www.realelitecontracting.com" }],
  "paths": {
    "/api/agents/grokbot/tasks": {
      "post": {
        "operationId": "grokbot_create_task",
        "security": [{ "bearer": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["requestingAgent", "instruction"],
                "properties": {
                  "taskId": { "type": "string" },
                  "requestingAgent": { "type": "string" },
                  "instruction": { "type": "string" },
                  "context": { "type": "object" },
                  "permissions": { "type": "array", "items": { "type": "string" } },
                  "createdAt": { "type": "string" }
                }
              }
            }
          }
        }
      }
    },
    "/api/agents/grokbot/tasks/{taskId}": {
      "get": {
        "operationId": "grokbot_get_task",
        "security": [{ "bearer": [] }],
        "parameters": [{ "name": "taskId", "in": "path", "required": true, "schema": { "type": "string" } }]
      }
    }
  },
  "components": {
    "securitySchemes": {
      "bearer": { "type": "http", "scheme": "bearer" }
    }
  }
}
```

Internal tools (same Bearer): `search_leads`, `get_lead`, `get_conversation`,
`draft_customer_reply`, `send_customer_reply`, `create_followup`,
`update_lead_status`, `create_estimate_draft`, `get_customer`, `assign_lead`.

## G. Blockers (honest)

- **Thumbtack Partner / Pro permissions.** Webhooks are registered via OAuth
  (`/api/v4/businesses/{id}/webhooks`). Jose still needs Partner access or a
  Pro setting that can POST to the URL. Outbound send APIs are **not wired
  with live tokens** — Send is stubbed (`thumbtack_outbound_not_configured`).
- **Supabase tables.** `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` may
  already exist for the marketing `leads` ledger. Sales-ops needs
  `docs/sql/sales-ops.sql` run once or the command center will not survive
  serverless cold starts.
- **GROKBOT_API_KEY** must be set in Vercel or the ChatGPT bridge 503s.
- **ADMIN_TOOLS_KEY** must be set or `/sales` cannot load leads.
- **XAI_API_KEY / OPENAI_API_KEY** unused for v1 drafts (deterministic
  engine). Optional later.
- **QBO / Calendar / Gmail** are interfaces only — no fake credentials.
- **Website `/api/estimate`** is not yet dual-written into sales-ops.
- titan-field-service / uplinq-platform were not found on GitHub to reuse.
