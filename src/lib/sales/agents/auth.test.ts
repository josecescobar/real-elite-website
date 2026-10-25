import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { authorizeAgent, parseRequestedScopes } from './auth';
import { ALL_SCOPES } from './scopes';

const GROK = 'test-grokbot-key-value';
const ADMIN = 'test-admin-key-value';

beforeEach(() => {
  process.env.GROKBOT_API_KEY = GROK;
  process.env.ADMIN_TOOLS_KEY = ADMIN;
  delete process.env.GROKBOT_SCOPES;
});

afterEach(() => {
  delete process.env.GROKBOT_API_KEY;
  delete process.env.ADMIN_TOOLS_KEY;
  delete process.env.GROKBOT_SCOPES;
});

describe('authorizeAgent key transport (audit M1)', () => {
  it('ignores a ?key= query parameter: 401 with no header', () => {
    for (const key of [GROK, ADMIN]) {
      const auth = authorizeAgent(new Request(`http://localhost/api/sales/leads?key=${key}`));
      expect(auth).toMatchObject({ ok: false, status: 401 });
    }
  });

  it('accepts Authorization: Bearer', () => {
    const auth = authorizeAgent(
      new Request('http://localhost/x', { headers: { authorization: `Bearer ${ADMIN}` } })
    );
    expect(auth).toMatchObject({ ok: true, via: 'admin' });
  });

  it.each(['x-admin-key', 'x-api-key', 'x-grokbot-key'])('accepts the %s header', (header) => {
    const auth = authorizeAgent(new Request('http://localhost/x', { headers: { [header]: GROK } }));
    expect(auth).toMatchObject({ ok: true, via: 'grokbot' });
  });

  it('accepts a key the route parsed from a POST body', () => {
    const auth = authorizeAgent(new Request('http://localhost/x', { method: 'POST' }), { bodyKey: ADMIN });
    expect(auth).toMatchObject({ ok: true, via: 'admin' });
  });

  it('rejects a wrong header key even when ?key= is correct', () => {
    const auth = authorizeAgent(
      new Request(`http://localhost/x?key=${ADMIN}`, { headers: { authorization: 'Bearer nope' } })
    );
    expect(auth).toMatchObject({ ok: false, status: 401 });
  });
});

describe('authorizeAgent per-key scopes (audit M4)', () => {
  const grokReq = () =>
    new Request('http://localhost/x', { headers: { authorization: `Bearer ${GROK}` } });
  const adminReq = () =>
    new Request('http://localhost/x', { headers: { authorization: `Bearer ${ADMIN}` } });

  it('gives the admin key every scope, including leads:send', () => {
    const auth = authorizeAgent(adminReq(), { required: ['leads:send'] });
    expect(auth).toMatchObject({ ok: true, via: 'admin' });
    if (!auth.ok) return;
    expect(auth.scopes).toContain('leads:send');
    expect(auth.scopes).toEqual(
      expect.arrayContaining([
        'leads:read',
        'leads:write',
        'leads:draft',
        'leads:send',
        'customers:read',
        'estimates:write',
        'tasks:write',
      ])
    );
  });

  it('defaults the grokbot key to a reduced set with no leads:send', () => {
    const auth = authorizeAgent(grokReq());
    expect(auth).toMatchObject({ ok: true, via: 'grokbot' });
    if (!auth.ok) return;
    expect(auth.scopes).not.toContain('leads:send');
    expect(auth.scopes).toEqual(
      expect.arrayContaining(['leads:read', 'leads:write', 'leads:draft', 'customers:read', 'estimates:write', 'tasks:write'])
    );
  });

  it('returns 403 when the grokbot key is missing a required scope', () => {
    const auth = authorizeAgent(grokReq(), { required: ['leads:send'] });
    expect(auth).toEqual({ ok: false, status: 403, error: 'Insufficient scope.' });
  });

  it('honors GROKBOT_SCOPES and ignores unknown tokens', () => {
    process.env.GROKBOT_SCOPES = 'leads:read, leads:send, not-a-scope';
    const auth = authorizeAgent(grokReq(), { required: ['leads:send'] });
    expect(auth).toMatchObject({ ok: true, via: 'grokbot' });
    if (!auth.ok) return;
    expect(auth.scopes).toEqual(['leads:read', 'leads:send']);
  });

  it('does not let GROKBOT_SCOPES shrink the admin key', () => {
    process.env.GROKBOT_SCOPES = 'leads:read';
    const auth = authorizeAgent(adminReq(), { required: ['leads:send'] });
    expect(auth).toMatchObject({ ok: true, via: 'admin' });
  });

  it('fail-closes when GROKBOT_SCOPES is set but contains no valid scope', () => {
    process.env.GROKBOT_SCOPES = 'nope';
    const auth = authorizeAgent(grokReq(), { required: ['leads:read'] });
    expect(auth).toEqual({ ok: false, status: 403, error: 'Insufficient scope.' });
  });

  it('treats a blank GROKBOT_SCOPES as the reduced default', () => {
    process.env.GROKBOT_SCOPES = '   ';
    const auth = authorizeAgent(grokReq(), { required: ['leads:send'] });
    expect(auth).toEqual({ ok: false, status: 403, error: 'Insufficient scope.' });
  });
});

describe('parseRequestedScopes', () => {
  it('treats a missing value as every scope', () => {
    expect(parseRequestedScopes(undefined)).toEqual([...ALL_SCOPES]);
    expect(parseRequestedScopes(null)).toEqual([...ALL_SCOPES]);
  });

  it('keeps only known scopes from an explicit list', () => {
    expect(parseRequestedScopes(['nope', 'leads:read', 'leads:read'])).toEqual(['leads:read', 'leads:read']);
  });

  it('returns an empty set for an explicit empty list', () => {
    expect(parseRequestedScopes([])).toEqual([]);
  });

  it('returns an empty set when every name is unknown', () => {
    expect(parseRequestedScopes(['nope', 'also-nope', 1, null])).toEqual([]);
  });
});
