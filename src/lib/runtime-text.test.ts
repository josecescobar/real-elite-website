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

/**
 * Attributes whose value is an EXPRESSION rather than a bare string.
 *
 * The attribute walk tested `isStringLiteral` on the initializer alone, so
 * `aria-label={'copy'}` and `title={`copy ${x}`}` were both invisible — and
 * because the JSX-root branch returns before the generic visitor runs, nothing
 * else picked them up either. This is live shape, not hypothetical:
 * `CityPageTemplate.tsx` carries `title={`Premium contracting in ${city.city}.`}`
 * and GalleryGrid carries `aria-label={`Open project image: ${image.alt}`}`,
 * and the scanner saw neither. Codex found it on #148.
 *
 * Latent rather than live, measured both ways: the same 21 claim-bearing files
 * in `src` before and after, so nothing was escaping the discovery guard — but
 * the next claim phrase written into an `aria-label` would have.
 */
describe('runtimeTextOfSource — expression-valued attributes', () => {
  it('finds a literal wrapped in an expression container', () => {
    const text = runtimeTextOfSource(
      "const C = () => <div aria-label={'written workmanship warranty'}>x</div>;"
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('finds a template literal in an attribute on the JSX root', () => {
    // The live CityPageTemplate shape.
    const text = runtimeTextOfSource(
      'const C = ({ city }) => <div title={`One named project lead in ${city}.`}>x</div>;'
    );
    expect(text).toMatch(/named project lead/i);
  });

  it('finds a template literal in an attribute on a nested element', () => {
    const text = runtimeTextOfSource(
      'const C = ({ n }) => <p><img alt={`Daily updates on ${n} jobs`} src="/x.png" /></p>;'
    );
    expect(text).toMatch(/daily updates/i);
  });

  it('finds a literal in an expression attribute on a nested self-closing element', () => {
    const text = runtimeTextOfSource(
      "const C = () => <p><img alt={'written workmanship warranty'} src=\"/x.png\" /></p>;"
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('finds both branches of a conditional attribute without fusing them', () => {
    const text = runtimeTextOfSource(
      "const C = ({ ok }) => <div aria-label={ok ? 'clean job' : 'site'}>x</div>;"
    );
    expect(text).toMatch(/clean job/i);
    expect(text).toMatch(/site/i);
    // Only one branch ever renders, so the page never shows the fused phrase.
    expect(text).not.toMatch(/clean job site/i);
  });

  it('does not invent text for an opaque attribute value', () => {
    // `alt={img.alt}` carries no literal at all. It must contribute nothing
    // rather than an empty run, and must not fuse the text around it.
    const text = runtimeTextOfSource(
      'const C = ({ img }) => <p>workmanship <img alt={img.alt} src="/x.png" /> warranty</p>;'
    );
    expect(text).not.toMatch(/workmanship warranty/i);
  });
});

/**
 * Literals inside a template literal's INTERPOLATIONS.
 *
 * The template branch recorded only the static head and tails, and `visit`
 * returns immediately after a TemplateExpression, so nothing reached the
 * expressions. The same omission as the JSX-expression one above, in the other
 * syntax: `{expr}` was traversed and `${expr}` was not.
 *
 * Latent, measured: no claim copy sits inside any template interpolation in
 * `src` today, so nothing was escaping — but the shape is one line of ordinary
 * code away.
 */
describe('runtimeTextOfSource — literals inside template interpolations', () => {
  it('finds a literal behind a conditional interpolation', () => {
    const text = runtimeTextOfSource(
      "const s = `${enabled ? 'written workmanship warranty' : ''}`;"
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('finds a bare literal interpolation', () => {
    const text = runtimeTextOfSource("const s = `Includes ${'one named project lead'} per job.`;");
    expect(text).toMatch(/named project lead/i);
  });

  it('finds a literal behind a call in an interpolation', () => {
    const text = runtimeTextOfSource("const s = `${t('daily updates')} weekly.`;");
    expect(text).toMatch(/daily updates/i);
  });

  it('does not fuse the branches of a conditional interpolation', () => {
    const text = runtimeTextOfSource("const s = `${ok ? 'clean job' : 'site'}`;");
    expect(text).not.toMatch(/clean job site/i);
  });

  it('does not fuse the static text around an opaque interpolation', () => {
    const text = runtimeTextOfSource('const s = `workmanship ${x} warranty`;');
    expect(text).not.toMatch(/workmanship warranty/i);
  });

  it('finds a literal in a template inside a JSX attribute interpolation', () => {
    // Both fixes meeting: an attribute holding a template whose interpolation
    // holds the literal.
    const text = runtimeTextOfSource(
      "const C = ({ ok }) => <div title={`${ok ? 'written workmanship warranty' : ''}`}>x</div>;"
    );
    expect(text).toMatch(/workmanship warranty/i);
  });
});

/**
 * Concatenation, and nested templates behind an opaque expression.
 *
 * Two more traversal gaps, both found on #148. Concatenation renders
 * contiguously but was emitted as separate newline-delimited runs — the same
 * adjacency mistake as inline markup, in expression form. And `collectLiterals`
 * carried its own copy of the template-literal logic which never visited the
 * span expressions, so the interpolation traversal added to `renderedTextOf`
 * was bypassed whenever a template sat inside an opaque expression. Duplicated
 * logic fixed in one place only.
 */
describe('runtimeTextOfSource — concatenation and nesting', () => {
  it('keeps concatenated literals together', () => {
    const text = runtimeTextOfSource(
      "const C = () => <p>{'written workmanship ' + 'warranty'}</p>;"
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('keeps a three-part concatenation together', () => {
    const text = runtimeTextOfSource(
      "const s = 'one ' + 'named project' + ' lead';"
    );
    expect(text).toMatch(/named project lead/i);
  });

  it('keeps concatenation together across an interpolated value', () => {
    const text = runtimeTextOfSource("const s = 'daily updates' + ' on ' + n + ' jobs';");
    expect(text).toMatch(/daily updates/i);
  });

  /**
   * `||`, `??` and `&&` SELECT one side rather than joining them, so their
   * operands must stay separate or the scan invents a phrase. Only `+` joins.
   */
  it('does not fuse the operands of a selecting operator', () => {
    expect(runtimeTextOfSource("const s = 'clean job' || 'site';")).not.toMatch(
      /clean job site/i
    );
    expect(runtimeTextOfSource("const s = 'clean job' ?? 'site';")).not.toMatch(
      /clean job site/i
    );
  });

  it('finds a literal in a template nested inside an opaque expression', () => {
    const text = runtimeTextOfSource(
      "const C = () => <p>{format(`${ok ? 'written workmanship warranty' : ''}`)}</p>;"
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('finds a literal in a template nested two levels deep', () => {
    const text = runtimeTextOfSource(
      "const C = () => <p>{wrap(fmt(`${'one named project lead'}`))}</p>;"
    );
    expect(text).toMatch(/named project lead/i);
  });
});

/**
 * Text either side of a CHOICE.
 *
 * `'written workmanship ' + (ok ? 'warranty' : '')` renders the claim on one
 * branch, but joining the operands' text gave "written workmanship  " — the
 * choice contributed a space and the phrase never formed. Concatenation now
 * resolves through `variantsOf`, which enumerates what the expression can
 * render, so each branch keeps the text around it. Codex found it on #148.
 *
 * Latent, measured: no concatenation with a selecting operand exists anywhere
 * in `src`.
 */
describe('runtimeTextOfSource — concatenation across a choice', () => {
  it('keeps the left operand against each branch of a conditional', () => {
    const text = runtimeTextOfSource(
      "const s = 'written workmanship ' + (ok ? 'warranty' : '');"
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('keeps the right operand against each branch', () => {
    const text = runtimeTextOfSource("const s = (ok ? 'daily' : 'weekly') + ' updates';");
    expect(text).toMatch(/daily updates/i);
  });

  it('keeps both branches available, not just the first', () => {
    const text = runtimeTextOfSource(
      "const s = 'one ' + (ok ? 'named project lead' : 'clean job site');"
    );
    expect(text).toMatch(/named project lead/i);
    expect(text).toMatch(/clean job site/i);
  });

  it('works across a selecting operator as well as a ternary', () => {
    const text = runtimeTextOfSource("const s = 'written workmanship ' + (x || 'warranty');");
    expect(text).toMatch(/workmanship warranty/i);
  });

  it('resolves a choice inside JSX', () => {
    const text = runtimeTextOfSource(
      "const C = ({ ok }) => <p>{'written workmanship ' + (ok ? 'warranty' : '')}</p>;"
    );
    expect(text).toMatch(/workmanship warranty/i);
  });

  /**
   * The alternatives must not be joined TO EACH OTHER: only one renders, so a
   * phrase spanning two branches is one the page never paints.
   */
  it('does not fuse two branches into one phrase', () => {
    const text = runtimeTextOfSource("const s = 'x' + (ok ? 'clean job' : 'site');");
    expect(text).not.toMatch(/clean job site/i);
  });

  it('still does not fuse across a genuinely opaque operand', () => {
    const text = runtimeTextOfSource("const s = 'workmanship ' + value + ' warranty';");
    expect(text).not.toMatch(/workmanship warranty/i);
  });
});
