import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const SQL_PATH = join(ROOT, 'docs/sql/sms-consent-state.sql');
const DOC_PATH = join(ROOT, 'docs/SMS_ENROLLMENT_SETUP.md');

function executableSql(source: string): string {
  return source
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function postgresBin(name: string): string {
  const versions = ['18', '17', '16', '15', '14'];
  const candidates = [
    name,
    ...versions.flatMap((version) => [
      `/opt/homebrew/opt/postgresql@${version}/bin/${name}`,
      `/usr/lib/postgresql/${version}/bin/${name}`,
    ]),
  ];
  for (const candidate of candidates) {
    if (candidate !== name && !existsSync(candidate)) continue;
    try {
      execFileSync(candidate, ['--version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      return candidate;
    } catch {
      // Try the next install layout.
    }
  }
  throw new Error(`${name} is required to execute docs/sql/sms-consent-state.sql`);
}

function scenario(output: string, name: string): string {
  const start = output.indexOf(`scenario = "${name}"`);
  expect(start, output).toBeGreaterThanOrEqual(0);
  const end = output.indexOf('----', start);
  return output.slice(start, end === -1 ? undefined : end);
}

describe('claim_sms_enrollment_send SQL', () => {
  it('rejects stale pre-STOP evidence without clearing STOP', () => {
    const schema = executableSql(readFileSync(SQL_PATH, 'utf8'));
    const documented = readFileSync(DOC_PATH, 'utf8').match(/```sql\n([\s\S]*?)```/);
    expect(documented, 'SMS_ENROLLMENT_SETUP.md must keep the executable SQL').not.toBeNull();
    expect(executableSql(documented?.[1] ?? '')).toBe(schema);

    const script = executableSql(`
      create role service_role;
      ${schema}
      insert into public.sms_consent_evidence (
        id, phone_e164, consent, text_version, consent_text, consented_at
      ) values
        ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '+16815550142', true, 'v1', 'consent', now() - interval '1 hour'),
        ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '+16815550142', true, 'v1', 'consent', now() - interval '30 minutes'),
        ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '+16815550143', true, 'v1', 'consent', now() - interval '2 hours'),
        ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', '+16815550143', true, 'v1', 'consent', now());

      select 'initial_claim' as scenario,
        public.claim_sms_enrollment_send('+16815550142', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'v1') as result;
      select 'inflight_replay' as scenario,
        public.claim_sms_enrollment_send('+16815550142', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'v1') as result;
      update public.sms_phone_state set send_status = 'accepted' where phone_e164 = '+16815550142';
      select 'accepted_replay' as scenario,
        public.claim_sms_enrollment_send('+16815550142', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'v1') as result;
      update public.sms_phone_state
        set consent = false, stopped = true, updated_at = now()
        where phone_e164 = '+16815550142';
      select 'stale_pre_stop_evidence_claim' as scenario,
        public.claim_sms_enrollment_send('+16815550142', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'v1') as result;
      select 'state_after_stale_claim' as scenario, consent, stopped, send_status
        from public.sms_phone_state where phone_e164 = '+16815550142';

      select public.claim_sms_enrollment_send('+16815550143', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'v1');
      update public.sms_phone_state
        set send_status = 'accepted', stopped = true, stopped_at = now() - interval '1 hour'
        where phone_e164 = '+16815550143';
      select 'stale_against_stopped_at' as scenario,
        public.claim_sms_enrollment_send('+16815550143', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'v1') as result;
      select 'ordered_reenrollment' as scenario,
        public.claim_sms_enrollment_send('+16815550143', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'v1') as result;
      select 'state_after_reenrollment' as scenario, consent, stopped, send_status
        from public.sms_phone_state where phone_e164 = '+16815550143';
    `);

    const dataDir = mkdtempSync(join(tmpdir(), 'sms-enrollment-sql-'));
    try {
      execFileSync(postgresBin('initdb'), ['-D', dataDir, '-A', 'trust', '--no-locale'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      const output = execFileSync(postgresBin('postgres'), ['--single', '-D', dataDir, 'postgres'], {
        encoding: 'utf8',
        input: script,
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 30_000,
      });

      expect(scenario(output, 'initial_claim')).toContain('"claimed": true');
      expect(scenario(output, 'inflight_replay')).toContain('"reason": "replay"');
      expect(scenario(output, 'accepted_replay')).toContain('"reason": "replay"');

      const stale = scenario(output, 'stale_pre_stop_evidence_claim');
      expect(stale).toContain('"claimed": false');
      expect(stale).toContain('"reason": "stopped"');
      expect(stale).not.toContain('"claimed": true');

      const staleState = scenario(output, 'state_after_stale_claim');
      expect(staleState).toContain('consent = "f"');
      expect(staleState).toContain('stopped = "t"');
      expect(staleState).toContain('send_status = "accepted"');

      const staleTimestamp = scenario(output, 'stale_against_stopped_at');
      expect(staleTimestamp).toContain('"reason": "stopped"');
      expect(staleTimestamp).not.toContain('"claimed": true');

      expect(scenario(output, 'ordered_reenrollment')).toContain('"claimed": true');
      const reenrolled = scenario(output, 'state_after_reenrollment');
      expect(reenrolled).toContain('consent = "t"');
      expect(reenrolled).toContain('stopped = "f"');
      expect(reenrolled).toContain('send_status = "claimed"');
    } finally {
      rmSync(dataDir, { recursive: true, force: true });
    }
  }, 60_000);
});
