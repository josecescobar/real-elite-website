// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import ts from 'typescript';
import type { Project } from './types';

const importer = join(process.cwd(), 'scripts/import-case-study.mjs');
async function fixture(extra = '', body = '') {
  const root = mkdtempSync(join(process.env.PAPERCLIP_RUN_SCRATCH_DIR || tmpdir(), 'case-study-'));
  const source = join(root, 'export');
  const output = join(root, 'website');
  mkdirSync(join(source, 'images'), { recursive: true });
  mkdirSync(output);
  const photo = await sharp({ create: { width: 32, height: 24, channels: 3, background: '#888888' } }).jpeg().toBuffer();
  for (const name of ['hero', 'before-1', 'after-1', 'gallery-01-after']) writeFileSync(join(source, 'images', `${name}.jpg`), photo);
  const markdown = `---
title: Kitchen Refresh
slug: _sample-job
location: Leesburg, VA
status: published
featured: true
hero: images/hero.jpg
generated: 2026-09-27
${extra}---
## What was there
[Confirm the original space.]

## What changed
Cabinets and trim.

## The result
[Confirm the result.]

> “Not an approved review” — Customer

## Before & after
| ![Original room](images/before-1.jpg) | ![Finished room](images/after-1.jpg) |

## Gallery
![Cabinets](images/gallery-01-after.jpg)

## Project facts
- **Timeline:** 2026-09-03 → 2026-09-20
${body}`;
  writeFileSync(join(source, 'case-study.md'), markdown);
  const run = (...args: string[]) => spawnSync(process.execPath, [importer, source, '--output-root', output, ...args], { encoding: 'utf8' });
  const projectPath = join(output, 'src/lib/projects/data/sample-job.ts');
  const readProject = () => {
    const compiled = ts.transpileModule(readFileSync(projectPath, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    const exports: { default?: Project } = {};
    new Function('exports', compiled)(exports);
    return exports.default!;
  };
  return { root, source, output, run, projectPath, readProject };
}

describe('MediaForge draft importer', () => {
  it('imports inert, typed draft data and optimized local media, with no invented completion or review', async () => {
    const f = await fixture();
    const result = f.run();
    expect(result.status, result.stderr).toBe(0);
    const p = f.readProject();
    expect(p).toMatchObject({ slug: 'sample-job', status: 'draft', featured: false, service: 'kitchens', citySlug: 'leesburg-va', completedOn: '' });
    expect(p.review).toBeUndefined();
    expect(p.outcome).toEqual(['[Confirm the result.]']);
    expect(p.beforeAfter?.[0].before.alt).toBe('Original room');
    expect(p.gallery[0].alt).toBe('Cabinets');
    const image = await sharp(join(f.output, 'public', p.hero.image.src)).metadata();
    expect(image.format).toBe('webp');
    expect(image.exif).toBeUndefined();
    expect(readFileSync(join(f.output, 'src/lib/projects/registry.generated.ts'), 'utf8')).toContain("from './data/sample-job'");
    expect(readFileSync(join(f.source, 'case-study.md'), 'utf8')).toContain('status: published');
  });

  it('refuses to overwrite a project that has since been published', async () => {
    const f = await fixture();
    expect(f.run().status).toBe(0);
    const approved = readFileSync(f.projectPath, 'utf8').replace('"status": "draft"', '"status": "published"');
    writeFileSync(f.projectPath, approved);
    expect(f.run().stderr).toContain('Refusing to overwrite');
    expect(readFileSync(f.projectPath, 'utf8')).toBe(approved);
  });

  it('accepts confirmed canonical overrides and a real completion date', async () => {
    const f = await fixture();
    expect(f.run('--service', 'remodeling', '--city', 'ashburn-va', '--completed-on', '2026-09-20').status).toBe(0);
    expect(f.readProject()).toMatchObject({ service: 'remodeling', citySlug: 'ashburn-va', completedOn: '2026-09-20', status: 'draft' });
  });

  it.each([
    ['--service', 'electrical'], ['--city', 'unknown-city'], ['--completed-on', '2026-02-30'],
    ['--slug', '../escape'], ['--status', 'published'],
  ])('rejects invalid or publication options before creating output: %s %s', async (...args) => {
    const f = await fixture();
    expect(f.run(...args).status).not.toBe(0);
    expect(existsSync(join(f.output, 'src'))).toBe(false);
    expect(existsSync(join(f.output, 'public'))).toBe(false);
  });

  it.each(['../outside.jpg', 'https://example.com/photo.jpg', 'images/missing.jpg'])('rejects unsafe or missing image %s without partial output', async (ref) => {
    const f = await fixture();
    const path = join(f.source, 'case-study.md');
    writeFileSync(path, readFileSync(path, 'utf8').replace('hero: images/hero.jpg', `hero: ${ref}`));
    expect(f.run().status).not.toBe(0);
    expect(existsSync(join(f.output, 'public'))).toBe(false);
  });

  it('rejects executable frontmatter without evaluating it', async () => {
    const f = await fixture();
    writeFileSync(join(f.source, 'case-study.md'), '---javascript\n({ title: process.exit(0) })\n---');
    expect(f.run().stderr).toContain('Expected YAML frontmatter');
    expect(existsSync(join(f.output, 'src'))).toBe(false);
  });

  it('rejects invalid unquoted YAML dates instead of normalizing them', async () => {
    const f = await fixture('completedOn: 2026-02-30\n');
    expect(f.run().stderr).toContain('real YYYY-MM-DD');
    expect(existsSync(join(f.output, 'src'))).toBe(false);
  });

  it('rejects source image symlinks', async () => {
    const f = await fixture();
    symlinkSync(join(f.source, 'images/hero.jpg'), join(f.source, 'images/hero.webp'));
    expect(f.run().stderr).toContain('Symlinks are not allowed');
    expect(existsSync(join(f.output, 'public'))).toBe(false);
  });

  it('rejects symlinked output paths', async () => {
    const f = await fixture();
    symlinkSync(f.source, join(f.output, 'public'));
    expect(f.run().stderr).toContain('Symlinks are not allowed');
    expect(existsSync(f.projectPath)).toBe(false);
  });
});
