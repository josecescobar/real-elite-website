import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { authorizeAgent } from './auth';

const GROK = 'test-grokbot-key-value';
const ADMIN = 'test-admin-key-value';

beforeEach(() => {
  process.env.GROKBOT_API_KEY = GROK;
  process.env.ADMIN_TOOLS_KEY = ADMIN;
});

afterEach(() => {
  delete process.env.GROKBOT_API_KEY;
  delete process.env.ADMIN_TOOLS_KEY;
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
