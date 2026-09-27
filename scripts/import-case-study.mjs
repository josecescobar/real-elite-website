#!/usr/bin/env node
// Local-only MediaForge intake. Publication is always a separate owner edit.
import { constants, existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { createRequire } from 'node:module';
import matter from 'gray-matter';
import sharp from 'sharp';
import ts from 'typescript';
import { generateRegistry } from './generate-projects-registry.mjs';

const require = createRequire(import.meta.url);
const yaml = createRequire(require.resolve('gray-matter'))('js-yaml');
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const textField = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be a nonempty string`);
  return value.trim();
};

// Load the site's own catalogs; no duplicated service/city list to drift.
async function catalogs() {
  const source = readFileSync(join(repoRoot, 'src/lib/constants.ts'), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

function section(body, heading) {
  const start = body.indexOf(`## ${heading}\n`);
  if (start < 0) return '';
  return body.slice(start + heading.length + 4).split(/^## /m)[0].trim();
}
function paragraphs(value) {
  return value.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !p.startsWith('>'));
}
function assertPlainPath(path, root) {
  // Reject symlink components, including dangling links, before reading/writing.
  const relative = path.slice(root.length + 1);
  let current = root;
  for (const part of relative.split('/')) {
    current = join(current, part);
    try {
      if (lstatSync(current).isSymbolicLink()) throw new Error(`Symlinks are not allowed: ${current}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}

export async function importCaseStudy(input, options = {}) {
  let source = realpathSync(resolve(input));
  if (lstatSync(source).isFile()) {
    if (basename(source) !== 'case-study.md') throw new Error('Expected case-study.md or its containing directory');
    source = dirname(source);
  }
  const markdown = join(source, 'case-study.md');
  assertPlainPath(markdown, source);
  const raw = readFileSync(markdown, 'utf8').replace(/\r\n/g, '\n');
  if (!raw.startsWith('---\n')) throw new Error('Expected YAML frontmatter starting with --- on its own line');
  const { data, content } = matter(raw, {
    engines: { yaml: (value) => yaml.safeLoad(value, { schema: yaml.JSON_SCHEMA }) },
  });
  const title = textField(data.title, 'title');
  const rawSlug = textField(options.slug ?? data.slug, 'slug');
  if (/[./\\]/.test(rawSlug)) throw new Error('slug must not contain path components');
  const slug = slugify(rawSlug);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('slug must contain letters or numbers');
  const { SERVICES, ALL_SERVICE_AREAS } = await catalogs();
  const citySlug = options.city ?? data.citySlug ?? slugify(textField(data.location, 'location'));
  const city = ALL_SERVICE_AREAS.find((area) => area.slug === citySlug);
  if (!city) throw new Error(`Unknown city "${citySlug}"; supply --city with a canonical service-area slug`);
  // Only infer unambiguous catalog names from the title, never individual job steps.
  const inferred = SERVICES.filter((service) => new RegExp(`\\b${service.slug.replace(/s$/, '')}s?\\b`, 'i').test(title));
  const service = options.service ?? data.service ?? (inferred.length === 1 ? inferred[0].slug : undefined);
  if (!SERVICES.some((item) => item.slug === service)) throw new Error('Supply --service with a canonical SERVICES slug (for example kitchens)');
  // A target date or export timestamp is not evidence that the job completed.
  const completedOn = options['completed-on'] ?? data.completedOn ?? '';
  if (completedOn && (typeof completedOn !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(completedOn) ||
      !Number.isFinite(Date.parse(completedOn)) || new Date(completedOn).toISOString().slice(0, 10) !== completedOn)) {
    throw new Error('completedOn must be a real YYYY-MM-DD date');
  }
  const root = realpathSync(resolve(options['output-root'] ?? repoRoot));
  const projectPath = join(root, 'src/lib/projects/data', `${slug}.ts`);
  const imagesPath = join(root, 'public/images/projects', slug);
  const registryPath = join(root, 'src/lib/projects/registry.generated.ts');
  for (const path of [projectPath, imagesPath, registryPath]) assertPlainPath(path, root);
  if (existsSync(projectPath) || existsSync(imagesPath)) throw new Error(`Refusing to overwrite existing project or images: ${slug}`);

  const assets = new Map();
  async function image(ref, alt) {
    if (typeof ref !== 'string' || !/^images\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|webp|png)$/.test(ref)) {
      throw new Error(`Expected a local images/<filename> image, received: ${ref}`);
    }
    const path = join(source, ref);
    assertPlainPath(path, source);
    const filename = basename(ref).replace(/\.[^.]+$/, '.webp');
    if (!assets.has(filename)) {
      // Prefer MediaForge's WebP twin, but validate the referenced original too.
      if (!lstatSync(path).isFile()) throw new Error(`Missing image: ${ref}`);
      const webp = path.replace(/\.[^.]+$/, '.webp');
      assertPlainPath(webp, source);
      const selected = existsSync(webp) ? webp : path;
      // Decode/re-encode strips metadata even when someone edits an export later.
      const buffer = await sharp(selected, { limitInputPixels: 40_000_000 }).rotate()
        .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 }).toBuffer();
      assets.set(filename, buffer);
    }
    return { src: `/images/projects/${slug}/${filename}`, alt: alt?.trim() || `${title} — project photo` };
  }
  const hero = await image(data.hero, `${title} — ${city.city}, ${city.state}`);
  const refs = (body) => [...body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
  const gallery = [];
  for (const [, alt, ref] of refs(section(content, 'Gallery'))) gallery.push(await image(ref, alt));
  const pairs = refs(section(content, 'Before & after'));
  if (pairs.length % 2) throw new Error('Before & after must contain complete image pairs');
  const beforeAfter = [];
  for (let i = 0; i < pairs.length; i += 2) {
    beforeAfter.push({ label: `Before and after ${i / 2 + 1}`, before: await image(pairs[i][2], pairs[i][1]), after: await image(pairs[i + 1][2], pairs[i + 1][1]) });
  }
  const brief = paragraphs(section(content, 'What was there'));
  const solution = paragraphs(section(content, 'What changed'));
  const outcome = paragraphs(section(content, 'The result'));
  const summary = typeof data.summary === 'string' && data.summary.trim() ? data.summary.trim() :
    solution[0] || '[Draft: describe the confirmed scope and result.]';
  const project = {
    slug, title, status: 'draft', featured: false, service, citySlug, completedOn,
    metaTitle: `${title} | Real Elite Project`, metaDescription: summary,
    keywords: [title, `${city.city} ${city.state}`, service], summary,
    hero: { heading: title, sub: summary, image: hero },
    brief: brief.length ? brief : ['[Draft: describe the original space and goals.]'],
    solution: solution.length ? solution : ['[Draft: describe the work completed.]'],
    outcome, beforeAfter, gallery: gallery.length ? gallery : [hero],
  };
  const module = `import type { Project } from '../types';\n\n// MediaForge draft. Jose must verify facts, consent, captions and claims before publication.\n// Empty completedOn means unknown; never substitute the planned finish or export date.\nconst project: Project = ${JSON.stringify(project, null, 2)};\n\nexport default project;\n`;
  // Validate every input before creating output. Exclusive writes preserve existing work.
  mkdirSync(dirname(projectPath), { recursive: true });
  mkdirSync(dirname(imagesPath), { recursive: true });
  mkdirSync(imagesPath);
  for (const [name, buffer] of assets) writeFileSync(join(imagesPath, name), buffer, { flag: constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL });
  writeFileSync(projectPath, module, { flag: 'wx' });
  generateRegistry(root);
  return { slug, status: 'draft', projectPath, images: assets.size, completedOn: completedOn || 'unknown — Jose must confirm' };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values, positionals } = parseArgs({ allowPositionals: true, options: {
      'output-root': { type: 'string' }, slug: { type: 'string' }, service: { type: 'string' },
      city: { type: 'string' }, 'completed-on': { type: 'string' },
    } });
    if (positionals.length !== 1) throw new Error('Usage: node scripts/import-case-study.mjs <export-directory|case-study.md> [--output-root DIR] [--slug SLUG] [--service SLUG] [--city SLUG] [--completed-on YYYY-MM-DD]');
    console.log(JSON.stringify(await importCaseStudy(positionals[0], values), null, 2));
    console.log('Draft only. Review docs/CASE-STUDY-PIPELINE.md before any publication.');
  } catch (error) {
    console.error(`[case-study] ${error.message}`);
    process.exitCode = 1;
  }
}
