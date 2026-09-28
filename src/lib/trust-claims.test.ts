import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { RETRACTED_TRUST_CLAIMS, CONTRACTOR_LICENSES, FEDERAL_REGISTRATION } from './claims';
import { runtimeTextOfFile } from './runtime-text';
import nextConfig from '../../next.config';

function filesIn(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  });
}

describe('credential and ranking claims', () => {
  it('keeps retracted trust claims off all source and editorial surfaces', () => {
    const files = filesIn('src').filter(file => /\.(ts|tsx)$/.test(file) && !file.includes('.test.') && file !== 'src/lib/claims.ts');
    const surfaces = files.map(file => [file, runtimeTextOfFile(path.resolve(file))]);
    surfaces.push(...filesIn('content/blog').filter(f => f.endsWith('.md')).map(file => [file, fs.readFileSync(file, 'utf8')]));
    surfaces.push(['public/llms.txt', fs.readFileSync('public/llms.txt', 'utf8')]);
    for (const [file, text] of surfaces) {
      for (const claim of RETRACTED_TRUST_CLAIMS) {
        expect(claim.patterns.some(pattern => pattern.test(text)), `${file}: ${claim.id}`).toBe(false);
      }
    }
  });

  it('allows a Maryland service-area mention that is not a license claim', () => {
    const text = 'Serving Frederick, Maryland. Licensed in West Virginia and Virginia.';
    expect(RETRACTED_TRUST_CLAIMS.filter(c => c.patterns.some(p => p.test(text)))).toEqual([]);
  });

  it('rejects veteran-owned wording and VOSB or SDVOSB certification claims', () => {
    const text = 'Real Elite is veteran-owned. SDVOSB certification in progress. Certified VOSB. VetCert application in progress.';
    const hits = RETRACTED_TRUST_CLAIMS.filter(c => c.patterns.some(p => p.test(text))).map(c => c.id);
    expect(hits).toContain('unsupported-veteran-ownership');
    expect(hits).toContain('unsupported-veteran-certification');
  });

  it('provides the exact license disclosure on both requested surfaces', () => {
    expect(CONTRACTOR_LICENSES.summary).toBe('WV Contractor License WV062432 · Virginia Class A Contractor 2705198604 (HIC)');
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
