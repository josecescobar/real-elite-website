import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function resolveAlias(specifier) {
  if (!specifier.startsWith('@/')) return null;
  const rel = specifier.slice(2);
  const base = join(root, 'src', rel);
  if (existsSync(`${base}.ts`)) return `${base}.ts`;
  if (existsSync(`${base}.tsx`)) return `${base}.tsx`;
  if (existsSync(join(base, 'index.ts'))) return join(base, 'index.ts');
  return base;
}

export async function resolve(specifier, context, nextResolve) {
  const file = resolveAlias(specifier);
  if (file) return nextResolve(pathToFileURL(file).href, context);
  return nextResolve(specifier, context);
}
