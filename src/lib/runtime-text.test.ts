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
