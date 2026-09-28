import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { RETRACTED_TRUST_CLAIMS, CONTRACTOR_LICENSES, FEDERAL_REGISTRATION } from './claims';
import { FORBIDDEN_VETERAN_CLAIMS } from './__tests__/forbidden-claim-terms';
import { runtimeTextOfFile } from './runtime-text';
import nextConfig from '../../next.config';

const retractedTrustClaims = [...RETRACTED_TRUST_CLAIMS, ...FORBIDDEN_VETERAN_CLAIMS];
const detectorSources = new Set([
  'src/lib/claims.ts',
  'src/lib/__tests__/forbidden-claim-terms.ts',
]);

function filesIn(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  });
}

describe('credential and ranking claims', () => {
  it('keeps retracted trust claims off all source and editorial surfaces', () => {
    const files = filesIn('src').filter(file => /\.(ts|tsx)$/.test(file) && !file.includes('.test.') && !detectorSources.has(file));
    const surfaces = files.map(file => [file, runtimeTextOfFile(path.resolve(file))]);
    surfaces.push(...filesIn('content/blog').filter(f => f.endsWith('.md')).map(file => [file, fs.readFileSync(file, 'utf8')]));
    surfaces.push(['public/llms.txt', fs.readFileSync('public/llms.txt', 'utf8')]);
    for (const [file, text] of surfaces) {
      for (const claim of retractedTrustClaims) {
        expect(claim.patterns.some(pattern => pattern.test(text)), `${file}: ${claim.id}`).toBe(false);
      }
    }
  });

  it('allows a Maryland service-area mention that is not a license claim', () => {
    const text = 'Serving Frederick, Maryland. Licensed in West Virginia and Virginia.';
    expect(retractedTrustClaims.filter(c => c.patterns.some(p => p.test(text)))).toEqual([]);
  });

  it('keeps the forbidden-term registry out of production modules', () => {
    const files = filesIn('src').filter(file => /\.(ts|tsx)$/.test(file) && !file.includes('.test.') && !file.endsWith('forbidden-claim-terms.ts'));
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8');
      expect(text, file).not.toMatch(/from\s+['"][^'"]*forbidden-claim-terms['"]/);
    }
  });

  it('rejects veteran-owned wording and VOSB or SDVOSB certification claims', () => {
    const text = 'Real Elite is veteran-owned. SDVOSB certification in progress. Certified VOSB. VetCert application in progress.';
    const hits = retractedTrustClaims.filter(c => c.patterns.some(p => p.test(text))).map(c => c.id);
    expect(hits).toContain('unsupported-veteran-ownership');
    expect(hits).toContain('unsupported-veteran-certification');
  });

  it('provides the exact license disclosure on both requested surfaces', () => {
    expect(CONTRACTOR_LICENSES.summary).toBe(
      'Licensed in Virginia (Class A Home Improvement Contractor) and West Virginia (WV062432).',
    );
    expect(CONTRACTOR_LICENSES).not.toHaveProperty('va');
    for (const file of ['src/app/about/page.tsx', 'src/components/layout/Footer.tsx']) {
      expect(fs.readFileSync(file, 'utf8')).toContain('{CONTRACTOR_LICENSES.summary}');
    }
  });

  it('retains the SAM registration and NAICS Jose confirmed without claiming certification', () => {
    expect(FEDERAL_REGISTRATION.summary).toBe('Registered in SAM.gov (UEI UZPDY2HUR9, CAGE 21N7T2)');
    expect(FEDERAL_REGISTRATION.naics.map(n => n.code)).toEqual(['236220', '238160', '238320', '238330', '238990', '236118']);
    expect(FEDERAL_REGISTRATION.naics.filter(n => n.primary).map(n => n.code)).toEqual(['236220']);
  });

  it('redirects the legacy about URL with the requested 301', async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects.find(r => r.source === '/about.html')).toEqual({ source: '/about.html', destination: '/about', statusCode: 301 });
  });
});
