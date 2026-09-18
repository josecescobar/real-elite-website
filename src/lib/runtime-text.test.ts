import { describe, it, expect } from 'vitest';
import { runtimeTextOfSource } from '@/lib/runtime-text';

/**
 * Fixtures for the scanner the claims guards depend on.
 *
 * It had none, which is why its adjacency bug was invisible: joining every
 * literal with a newline split `<p>Written workmanship <strong>warranty</strong></p>`
 * into two units, so `/workmanship warranty/i` missed a phrase the browser
 * paints contiguously. A claim split by ordinary inline markup escaped both the
 * discovery scan and the inventory check — a FALSE NEGATIVE, which is the bad
 * direction for a guard. Codex found it on #148.
 *
 * Both directions are asserted here: adjacency preserved where the rendered
 * output is adjacent, and separation kept where it is not.
 */
describe('runtimeTextOfSource — adjacency', () => {
  it('keeps a phrase together across inline markup', () => {
    const text = runtimeTextOfSource(
      'const C = () => <p>Written workmanship <strong>warranty</strong> on every job.</p>;'
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('keeps a phrase together across nested inline markup', () => {
    const text = runtimeTextOfSource(
      'const C = () => <p>One <em>named <b>project</b> lead</em> per job.</p>;'
    );
    expect(text).toMatch(/named project lead/i);
  });

  it('keeps a phrase together across an interpolated value', () => {
    const text = runtimeTextOfSource(
      'const C = ({ n }) => <p>Daily updates and a <span>{n}</span> clean job site.</p>;'
    );
    expect(text).toMatch(/daily updates/i);
    expect(text).toMatch(/clean job site/i);
  });

  it('keeps template-literal spans together across interpolation', () => {
    const text = runtimeTextOfSource(
      'const s = `One named project lead on every ${city} job.`;'
    );
    expect(text).toMatch(/named project lead/i);
  });

  it('does not fuse two unrelated string literals', () => {
    // "workmanship" and "warranty" are separate pieces of copy here; a scanner
    // that concatenated everything would invent a phrase neither one makes.
    const text = runtimeTextOfSource("const a = 'workmanship'; const b = 'warranty';");
    expect(text).not.toMatch(/workmanship warranty/i);
  });

  it('does not fuse text across two sibling JSX roots', () => {
    const text = runtimeTextOfSource(
      'const A = () => <p>written workmanship</p>;\nconst B = () => <p>warranty terms</p>;'
    );
    expect(text).not.toMatch(/workmanship warranty/i);
  });
});

describe('runtimeTextOfSource — literals inside opaque expressions', () => {
  /**
   * The rendered-run rewrite stopped traversing into JSX expressions, so
   * `{enabled && 'copy'}` scanned as a bare space and the copy vanished. The
   * flat version it replaced did collect it, which makes this a regression I
   * introduced while fixing adjacency. Codex caught it on #148.
   */
  it('finds a literal behind a logical-and', () => {
    const text = runtimeTextOfSource(
      "const C = () => <p>{enabled && 'written workmanship warranty'}</p>;"
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('finds literals in both branches of a conditional', () => {
    const text = runtimeTextOfSource(
      "const C = () => <p>{ok ? 'one named project lead' : 'daily updates'}</p>;"
    );
    expect(text).toMatch(/named project lead/i);
    expect(text).toMatch(/daily updates/i);
  });

  /**
   * But it must NOT fuse the branches: only one of them ever renders, so
   * joining them would invent a phrase the page never shows. This is why the
   * descendants become separate runs rather than being inlined.
   */
  it('does not fuse two branches of a conditional into one phrase', () => {
    const text = runtimeTextOfSource("const C = () => <p>{ok ? 'clean job' : 'site'}</p>;");
    expect(text).not.toMatch(/clean job site/i);
  });

  it('finds a literal behind a function call', () => {
    const text = runtimeTextOfSource(
      "const C = () => <p>{t('written workmanship warranty')}</p>;"
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('finds a template literal behind an expression', () => {
    const text = runtimeTextOfSource(
      'const C = () => <p>{cond && `One named project lead on ${n} jobs`}</p>;'
    );
    expect(text).toMatch(/named project lead/i);
  });

  it('keeps the surrounding text separated from the expression', () => {
    // "workmanship" and "warranty" sit either side of an opaque value; fusing
    // them would invent the claim.
    const text = runtimeTextOfSource('const C = () => <p>workmanship {x} warranty</p>;');
    expect(text).not.toMatch(/workmanship warranty/i);
  });
});

describe('runtimeTextOfSource — what counts as published', () => {
  it('excludes line comments', () => {
    const text = runtimeTextOfSource('// written workmanship warranty\nconst x = 1;');
    expect(text).not.toMatch(/workmanship warranty/i);
  });

  it('excludes block comments', () => {
    const text = runtimeTextOfSource('/* one named project lead */\nconst x = 1;');
    expect(text).not.toMatch(/named project lead/i);
  });

  it('keeps a URL in a string intact rather than treating // as a comment', () => {
    // The reason this uses the AST and not a regex stripper: a naive stripper
    // deletes from `//` to end of line, taking real copy with it.
    const text = runtimeTextOfSource(
      "const s = 'See https://example.com — written workmanship warranty included.';"
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('includes JSX attribute text such as alt and aria-label', () => {
    const text = runtimeTextOfSource(
      'const C = () => <img alt="written workmanship warranty badge" src="/x.png" />;'
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('includes plain string literals and no-substitution templates', () => {
    expect(runtimeTextOfSource("const a = 'daily updates';")).toMatch(/daily updates/i);
    expect(runtimeTextOfSource('const a = `clean job site`;')).toMatch(/clean job site/i);
  });

  it('scans .ts as well as .tsx', () => {
    const text = runtimeTextOfSource("export const X = ['daily updates'];", 'x.ts');
    expect(text).toMatch(/daily updates/i);
  });
});
