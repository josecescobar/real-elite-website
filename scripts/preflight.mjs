#!/usr/bin/env node
/**
 * One command that answers "is this branch shippable?"
 *
 * The full gate is four commands with different flags, and it is easy to run
 * three of them, get green, and push something the fourth would have caught.
 * This runs the whole sequence in order, stops at the first failure, and prints
 * a summary with timings.
 *
 *   npm run preflight            lint + typecheck + test + build
 *   npm run preflight -- --audit …and then serve the build and crawl it
 *
 * `--audit` is the slow, thorough mode: it builds, starts a production server
 * on a free port, runs scripts/audit-site.mjs against it, and shuts the server
 * down again — the same measurement the daily loop makes, on demand.
 *
 * Exit code is non-zero on the first failing step, so it composes with
 * `&&` and with any CI or hook that cares about a single status.
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

const wantAudit = process.argv.includes('--audit');

const STEPS = [
  { name: 'lint', cmd: 'npm', args: ['run', 'lint'] },
  { name: 'typecheck', cmd: 'npm', args: ['run', 'typecheck'] },
  { name: 'test', cmd: 'npm', args: ['test'] },
  {
    name: 'build',
    cmd: 'npm',
    args: ['run', 'build'],
    // Images in the repo are already optimised; re-encoding them adds minutes
    // and cannot fail in a way this gate is trying to catch.
    env: { SKIP_IMAGE_OPTIMIZE: '1' },
  },
];

function run(step) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(step.cmd, step.args, {
      stdio: 'inherit',
      env: { ...process.env, ...(step.env || {}) },
    });
    child.on('close', (code) =>
      resolve({ name: step.name, code, ms: Date.now() - started })
    );
  });
}

/** Ask the OS for a free port so parallel runs don't collide. */
function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function waitForServer(url, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

const results = [];
for (const step of STEPS) {
  console.log(`\n── ${step.name} ──`);
  const r = await run(step);
  results.push(r);
  if (r.code !== 0) {
    summarise(results, `failed at "${r.name}"`);
    process.exit(r.code || 1);
  }
}

if (wantAudit) {
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  console.log(`\n── audit (serving on ${port}) ──`);
  const server = spawn('npm', ['run', 'start'], {
    stdio: 'ignore',
    env: { ...process.env, PORT: String(port) },
    detached: true,
  });
  try {
    if (!(await waitForServer(base))) {
      console.error(`server never became ready on ${base}`);
      summarise(results, 'failed at "audit" (server did not start)');
      process.exit(1);
    }
    const started = Date.now();
    const audit = await new Promise((resolve) => {
      const c = spawn('node', ['scripts/audit-site.mjs', '--base', base], {
        stdio: 'inherit',
      });
      c.on('close', (code) => resolve(code));
    });
    results.push({ name: 'audit', code: audit, ms: Date.now() - started });
    if (audit !== 0) {
      summarise(results, 'failed at "audit"');
      process.exit(audit);
    }
  } finally {
    try {
      process.kill(-server.pid);
    } catch {
      try {
        server.kill();
      } catch {
        /* already gone */
      }
    }
  }
}

summarise(results, 'all green — shippable');

function summarise(rs, verdict) {
  const total = rs.reduce((n, r) => n + r.ms, 0);
  console.log('\n── preflight ──');
  for (const r of rs) {
    const mark = r.code === 0 ? 'ok  ' : 'FAIL';
    console.log(`  ${mark} ${r.name.padEnd(10)} ${(r.ms / 1000).toFixed(1)}s`);
  }
  console.log(`  ${verdict} (${(total / 1000).toFixed(1)}s)\n`);
}
