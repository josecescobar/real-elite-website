import ts from 'typescript';
import fs from 'node:fs';

/**
 * The text of a source file that can actually reach a rendered page: string
 * literals, template-literal spans, and JSX text. Comments are excluded.
 *
 * ## Why this exists
 *
 * `claimsFoundIn` matches patterns against raw text, so it counted COMMENTS as
 * published copy. That made the claims register's own guard unsound in the
 * worst possible way: `CityPageTemplate.tsx`'s docblock explaining the gate
 * contains the literal phrases "named project lead", "daily updates / clean
 * job site" and "written workmanship warranty" — so removing the rendered
 * strings from that file would have left its inventory entries passing, and
 * the retraction worklist wrong again. My own explanatory comment defeated the
 * guard I wrote to catch exactly that. Codex found it on #148.
 *
 * ## Why the TypeScript AST rather than stripping comments
 *
 * A regex comment-stripper is not safe here. `//` inside a string literal —
 * every `https://` URL in the codebase — looks like a line comment, so a naive
 * stripper deletes the rest of that line and can silently remove real copy.
 * That trades a false positive for a false negative, which is the worse
 * direction for a guard.
 *
 * `typescript` is already a dependency (it runs `npm run typecheck`), so the
 * scanner uses the real lexer and there is no heuristic to get wrong.
 *
 * ## Scope
 *
 * TEST SUPPORT ONLY. Nothing in the app imports this, and nothing should: it
 * pulls in the TypeScript compiler. It lives in `src/lib` rather than a test
 * directory so the claims guard and the discovery scan can share one
 * definition of "text that can reach a page".
 *
 * Non-code files (`.md`) have no comment syntax to confuse, so callers scan
 * those as raw text.
 */
export function runtimeTextOfSource(source: string, fileName = 'file.tsx'): string {
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ false,
    fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  const parts: string[] = [];
  const visit = (node: ts.Node): void => {
    if (
      ts.isStringLiteral(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isTemplateHead(node) ||
      ts.isTemplateMiddle(node) ||
      ts.isTemplateTail(node) ||
      ts.isJsxText(node)
    ) {
      parts.push(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  // Joined with newlines so a pattern cannot match across two unrelated
  // literals that happen to sit next to each other.
  return parts.join('\n');
}

/** `runtimeTextOfSource` for a file on disk; raw text for non-code files. */
export function runtimeTextOfFile(relPath: string): string {
  const source = fs.readFileSync(relPath, 'utf8');
  if (!/\.(ts|tsx)$/.test(relPath)) return source;
  return runtimeTextOfSource(source, relPath);
}
