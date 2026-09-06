'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import type { Lead, LeadBucket } from '@/lib/sales/types';

const KEY_STORAGE = 'realelite-admin-key';
const noopSubscribe = () => () => {};
const readSavedKey = () => window.localStorage.getItem(KEY_STORAGE);

const BUCKETS: Array<{ id: LeadBucket | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'hot', label: 'Hot' },
  { id: 'new', label: 'New' },
  { id: 'awaiting', label: 'Awaiting' },
  { id: 'follow_up', label: 'Follow-up' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
];

type LeadRow = Lead & { customer?: { fullName?: string; phone?: string | null; email?: string | null } | null };

const inputClass =
  'w-full px-3 py-2 border-2 rounded-md bg-white text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-400 border-charcoal-200 text-sm';

export default function SalesCommandCenter() {
  const savedKey = useSyncExternalStore(noopSubscribe, readSavedKey, () => null);
  const [typedKey, setTypedKey] = useState<string | null>(null);
  const accessKey = typedKey ?? savedKey ?? '';
  const [bucket, setBucket] = useState<LeadBucket | 'all'>('all');
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(() => leads.find((l) => l.id === selectedId) ?? null, [leads, selectedId]);

  async function loadLeads(nextBucket = bucket) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sales/leads?bucket=${nextBucket}&key=${encodeURIComponent(accessKey)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Could not load leads.');
        return;
      }
      window.localStorage.setItem(KEY_STORAGE, accessKey.trim());
      setLeads(data.leads ?? []);
    } catch {
      setError('Network error — try again.');
    } finally {
      setLoading(false);
    }
  }

  async function runAction(action: 'approve' | 'edit' | 'send' | 'pause' | 'takeover') {
    if (!selected) return;
    setNotice(null);
    setError(null);
    const res = await fetch(`/api/sales/leads/${selected.id}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: accessKey, action, draft }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Action failed.');
      return;
    }
    if (action === 'send' && data.sent === false) {
      setNotice(
        data.reason === 'thumbtack_outbound_not_configured'
          ? 'Draft saved. Thumbtack outbound is not wired — copy this reply into the Thumbtack app.'
          : `Send stubbed: ${data.reason}`
      );
    } else {
      setNotice(action === 'send' ? 'Sent.' : 'Updated.');
    }
    await loadLeads();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void loadLeads();
        }}
        className="bg-white rounded-lg shadow-card-elevated p-5 grid gap-3 sm:grid-cols-[1fr_auto]"
      >
        <input
          type="password"
          className={inputClass}
          placeholder="Access key"
          value={accessKey}
          onChange={(e) => setTypedKey(e.target.value)}
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-md bg-navy-800 text-white text-sm font-semibold hover:bg-navy-700"
        >
          {loading ? 'Loading…' : 'Open pipeline'}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {BUCKETS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setBucket(item.id);
              void loadLeads(item.id);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide ${
              bucket === item.id ? 'bg-navy-800 text-white' : 'bg-white text-navy-800 border border-steel-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? <p className="text-brand-red text-sm">{error}</p> : null}
      {notice ? <p className="text-navy-700 text-sm">{notice}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="bg-white rounded-lg shadow-card-elevated divide-y divide-steel-100">
          {leads.length === 0 ? (
            <p className="p-5 text-sm text-charcoal-600">
              No leads in this view. POST a simulated Thumbtack payload to{' '}
              <code>/api/webhooks/thumbtack</code> to seed the pipeline.
            </p>
          ) : (
            leads.map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => {
                  setSelectedId(lead.id);
                  setDraft(lead.draftReply ?? '');
                }}
                className={`w-full text-left p-4 hover:bg-steel-50 ${selectedId === lead.id ? 'bg-steel-50' : ''}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-navy-800 text-sm">
                    {lead.customer?.fullName || 'Customer'} · {lead.projectType || 'Project'}
                  </p>
                  <span className="text-xs font-bold text-brand-red">{lead.score}</span>
                </div>
                <p className="text-xs text-charcoal-600 mt-1">
                  {lead.city || lead.zip || '—'} · {lead.bucket} · {lead.source}
                  {lead.aiPaused ? ' · AI paused' : ''}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="bg-white rounded-lg shadow-card-elevated p-5 space-y-4">
          {!selected ? (
            <p className="text-sm text-charcoal-600">Select a lead to review the draft.</p>
          ) : (
            <>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] font-bold text-brand-red">
                  Score {selected.score} · {selected.bucket}
                </p>
                <h2 className="font-heading text-2xl font-extrabold text-navy-800">
                  {selected.customer?.fullName || 'Customer'}
                </h2>
                <p className="text-sm text-charcoal-600">
                  {selected.projectSummary || selected.projectType} — {selected.city} {selected.zip}
                </p>
                {selected.escalationReasons.length > 0 ? (
                  <p className="text-xs text-brand-red mt-2">
                    Escalate to Jose: {selected.escalationReasons.join(', ')}
                  </p>
                ) : null}
              </div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-700">
                Draft reply
                <textarea
                  className={`${inputClass} mt-2 min-h-56`}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="px-3 py-2 rounded-md bg-navy-800 text-white text-sm font-semibold" onClick={() => void runAction('approve')}>
                  Approve
                </button>
                <button type="button" className="px-3 py-2 rounded-md border border-navy-800 text-navy-800 text-sm font-semibold" onClick={() => void runAction('edit')}>
                  Save edit
                </button>
                <button type="button" className="px-3 py-2 rounded-md bg-brand-red text-white text-sm font-semibold" onClick={() => void runAction('send')}>
                  Send
                </button>
                <button type="button" className="px-3 py-2 rounded-md border border-steel-300 text-sm" onClick={() => void runAction('pause')}>
                  Pause AI
                </button>
                <button type="button" className="px-3 py-2 rounded-md border border-steel-300 text-sm" onClick={() => void runAction('takeover')}>
                  Take over
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
