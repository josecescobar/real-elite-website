import ts from 'typescript';
import fs from 'node:fs';

/**
 * The text of a source file that can actually reach a rendered page: string
 * literals, template-literal spans, JSX text and JSX attribute strings.
 * Comments are excluded.
 *
 * ## Why this exists
 *
 * `claimsFoundIn` matches patterns against raw text, so it counted COMMENTS as
 * published copy. `CityPageTemplate.tsx`'s docblock explaining the trust gate
 * contains the literal phrases "named project lead", "daily updates / clean
 * job site" and "written workmanship warranty" — so removing the rendered
 * strings from that file would have left its inventory entries passing, and the
 * claims register's retraction worklist wrong. My own explanatory comment
 * defeated the guard I wrote to catch exactly that.
 *
 * ## Why the TypeScript AST rather than stripping comments
 *
 * A regex comment-stripper is not safe here: `//` inside a string literal —
 * every `https://` URL in the codebase — looks like a line comment, so a naive
 * stripper deletes the rest of that line and can silently remove real copy.
 * That trades a false positive for a false negative, which is the worse
 * direction for a guard. `typescript` is already a dependency.
 *
 * ## Adjacency: why this is not just "collect the strings and join them"
 *
 * The first version pushed every literal into a flat list and joined with
 * newlines, reasoning that a separator stops a pattern matching across two
 * unrelated literals. That reasoning is right about unrelated literals and
 * wrong about a single rendered run. `<p>Written workmanship
 * <strong>warranty</strong></p>` renders the contiguous phrase "Written
 * workmanship warranty" but scanned as two units separated by a newline, so
 * `/workmanship warranty/i` did not match it. Splitting claim copy with inline
 * markup — an entirely ordinary JSX shape — made it invisible to both the
 * discovery scan and the inventory check. Codex found it on #148.
 *
 * So the unit of scanning is a RENDERED RUN, not a literal:
 *
 *   - a JSX element or fragment contributes its children's text CONCATENATED,
 *     recursively, because that is what the browser paints;
 *   - a template literal contributes its spans joined by a space, since the
 *     interpolated value renders between them;
 *   - everything else — a standalone string, a JSX attribute — is its own run.
 *
 * Runs are joined with newlines, so a pattern still cannot match across two
 * genuinely separate pieces of copy. Both directions are covered: adjacency is
 * preserved where the output is adjacent, and separated where it is not.
 *
 * ## Scope
 *
 * TEST SUPPORT ONLY. Nothing in the app imports this, and nothing should — it
 * pulls in the TypeScript compiler. It lives in `src/lib` so the claims guard
 * and the discovery scan share one definition of "text that can reach a page".
 *
 * Non-code files (`.md`) have no comment syntax to confuse, so callers scan
 * those as raw text.
 */

/** A type predicate, so callers get `children` narrowed rather than `Node`. */
const isJsxContainer = (node: ts.Node): node is ts.JsxElement | ts.JsxFragment =>
  ts.isJsxElement(node) || ts.isJsxFragment(node);

/**
 * What a JSX element paints, with its children concatenated.
 *
 * An expression container holding a literal contributes that literal; one
 * holding anything else (a variable, a call) contributes a single space, since
 * it renders *something* and the neutral assumption is that it separates the
 * text around it rather than fusing it.
 */
function renderedTextOf(
  node: ts.Node,
  consumed: Set<ts.Node>,
  sideRuns: string[]
): string {
  consumed.add(node);

  if (ts.isJsxText(node)) return node.text;

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;

  if (ts.isTemplateExpression(node)) {
    const parts = [node.head.text, ...node.templateSpans.map((s) => s.literal.text)];
    node.templateSpans.forEach((s) => consumed.add(s.literal));
    consumed.add(node.head);
    // The INTERPOLATIONS carry literals too. `${enabled ? 'copy' : ''}` put
    // its text nowhere: this branch recorded only the static head and tails,
    // and `visit` returns straight after a TemplateExpression, so the generic
    // walk never reached the expressions either. Codex found it on #148.
    //
    // This is the same omission as the JSX one fixed a commit earlier, in the
    // other syntax — `{expr}` was handled and `${expr}` was not. Each
    // interpolation resolves through renderedTextOf, so its literals land as
    // SEPARATE runs and a conditional's branches are still never fused.
    node.templateSpans.forEach((s) => {
      const inner = renderedTextOf(s.expression, consumed, sideRuns);
      if (inner.trim()) sideRuns.push(inner);
    });
    return parts.join(' ');
  }

  // `JsxExpression` is TypeScript's name for a `{...}` child. There is no
  // `isJsxExpressionContainer` in the TS API — that is Babel's name for it.
  if (ts.isJsxExpression(node)) {
    return node.expression ? renderedTextOf(node.expression, consumed, sideRuns) : '';
  }

  if (isJsxContainer(node)) {
    return node.children.map((child) => renderedTextOf(child, consumed, sideRuns)).join('');
  }

  if (ts.isJsxSelfClosingElement(node)) return '';

  // Concatenation renders CONTIGUOUSLY, so it is one run, not two.
  // `{'written workmanship ' + 'warranty'}` paints the phrase, but emitting
  // each operand separately put a newline between them and the pattern missed
  // it — the same adjacency mistake as the inline-markup one, in expression
  // form. Only `+` qualifies: every other binary operator (`||`, `??`, `&&`)
  // selects ONE side, so its operands must stay separate runs or the scan
  // invents phrases the page never renders.
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = renderedTextOf(node.left, consumed, sideRuns);
    const right = renderedTextOf(node.right, consumed, sideRuns);
    return left + right;
  }

  // Any OTHER expression — `{enabled && 'copy'}`, `{ok ? 'a' : 'b'}`, a call —
  // renders an unknown value, so it separates the text around it. But its
  // string-literal descendants can still reach the page, and returning a bare
  // space here lost them: `<p>{enabled && 'written workmanship warranty'}</p>`
  // scanned as " " and the claim vanished. The flat version this replaced did
  // collect it, so that was a regression, and Codex caught it on #148.
  //
  // Descendant literals are collected as SEPARATE runs rather than inlined.
  // Inlining them would fuse the branches of a conditional — `{ok ? 'clean
  // job' : 'site'}` would read as "clean job site", a phrase the page never
  // renders. Separate runs capture each literal without inventing a phrase,
  // and the space returned here keeps the surrounding text apart.
  collectLiterals(node, consumed, sideRuns);
  return ' ';
}

/** Every string-literal descendant of an opaque expression, as its own run. */
function collectLiterals(node: ts.Node, consumed: Set<ts.Node>, sideRuns: string[]): void {
  ts.forEachChild(node, (child) => {
    consumed.add(child);
    if (ts.isStringLiteral(child) || ts.isNoSubstitutionTemplateLiteral(child)) {
      sideRuns.push(child.text);
    } else if (ts.isTemplateExpression(child)) {
      // Route through renderedTextOf rather than re-deriving the text here.
      // This branch used to assemble head+tails itself and never visit the
      // span expressions, so it bypassed the interpolation traversal added to
      // renderedTextOf — a nested template inside an opaque expression, e.g.
      // `{format(`${ok ? 'copy' : ''}`)}`, lost its literal. Duplicated logic
      // fixed in one place only; Codex found the other copy on #148.
      sideRuns.push(renderedTextOf(child, consumed, sideRuns));
    } else if (isJsxContainer(child) || ts.isJsxSelfClosingElement(child)) {
      // Nested JSX inside an expression is still a rendered run of its own.
      sideRuns.push(renderedTextOf(child, consumed, sideRuns));
    } else {
      collectLiterals(child, consumed, sideRuns);
    }
  });
}

export function runtimeTextOfSource(source: string, fileName = 'file.tsx'): string {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  const runs: string[] = [];
  const consumed = new Set<ts.Node>();

  const visit = (node: ts.Node): void => {
    // A JSX root — one whose parent is not itself JSX — is a single rendered
    // run. Its descendants are marked consumed so they are not also emitted
    // as separate runs, which would reintroduce the split.
    if (isJsxContainer(node) && !(node.parent && isJsxContainer(node.parent))) {
      runs.push(renderedTextOf(node, consumed, runs));
      // Attributes are NOT part of the painted run, but alt/aria/title copy is
      // still published, so walk them separately.
      //
      // The initializer is not always a bare string. `aria-label={'the copy'}` wraps the
      // text in a JsxExpression, and `title={`Premium contracting in ${city}.`}`
      // wraps a template literal. Testing `isStringLiteral` alone missed BOTH,
      // and because this branch returns, the generic visitor never reached them
      // either — so every expression-valued attribute in the tree was invisible,
      // CityPageTemplate's own among them. Codex found it on #148.
      //
      // Routing through `renderedTextOf` reuses exactly the logic the children
      // already use: a literal or template comes back as text, an opaque value
      // comes back as a space and is dropped here, and a conditional's branches
      // land as separate runs rather than being fused into a phrase the page
      // never renders.
      ts.forEachChild(node, function attrs(child: ts.Node) {
        if (ts.isJsxAttribute(child) && child.initializer) {
          const text = renderedTextOf(child.initializer, consumed, runs);
          if (text.trim()) runs.push(text);
        }
        ts.forEachChild(child, attrs);
      });
      return;
    }

    if (consumed.has(node)) {
      ts.forEachChild(node, visit);
      return;
    }

    if (ts.isTemplateExpression(node)) {
      runs.push(renderedTextOf(node, consumed, runs));
      return;
    }

    // A concatenation reached outside JSX, e.g. `const s = 'a ' + 'b';`. The
    // JSX path routes through renderedTextOf and so joined these correctly,
    // but this walker had no branch for it and descended into the operands,
    // emitting each as its own run — so the same phrase held together inside
    // JSX and split apart in a plain module. Caught by the standalone fixture.
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      runs.push(renderedTextOf(node, consumed, runs));
      return;
    }

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      runs.push(node.text);
      return;
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return runs.join('\n');
}

/** `runtimeTextOfSource` for a file on disk; raw text for non-code files. */
export function runtimeTextOfFile(relPath: string): string {
  const source = fs.readFileSync(relPath, 'utf8');
  if (!/\.(ts|tsx)$/.test(relPath)) return source;
  return runtimeTextOfSource(source, relPath);
}
