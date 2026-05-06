#!/usr/bin/env node
/**
 * Local end-to-end wrapper: build → dev server on 127.0.0.1:4325 → verify:strategic-crawl.
 * Stops the server in `finally` so it exits even when the crawl fails.
 *
 * Note: `@astrojs/vercel` does not support `astro preview`; this uses `astro dev` on a fixed
 * host/port so the crawl sees the same app without changing `verify-strategic-crawl`.
 *
 * Staging / preview usage is unchanged:
 *   BASE_URL=https://… npm run verify:strategic-crawl
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, '..');
const HOST = '127.0.0.1';
const PORT = '4325';
const BASE_URL = `http://${HOST}:${PORT}`;

function runBuild() {
  const r = spawnSync('npm', ['run', 'build'], {
    cwd: siteRoot,
    stdio: 'inherit',
    shell: true,
  });
  if (r.error) {
    console.error(r.error);
    process.exit(1);
  }
  if (r.status !== 0) {
    process.exit(r.status === null ? 1 : r.status);
  }
}

async function waitForServer(origin, maxAttempts = 120) {
  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      await fetch(origin, {
        headers: { 'user-agent': 'schillings-strategic-crawl-local/1.0' },
        redirect: 'follow',
      });
      return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.error(`verify:strategic-crawl:local: server did not respond at ${origin}`);
  process.exit(1);
}

function runCrawl() {
  const r = spawnSync('npx', ['tsx', 'scripts/verify-strategic-crawl.ts'], {
    cwd: siteRoot,
    stdio: 'inherit',
    env: { ...process.env, BASE_URL },
  });
  return r.status ?? 1;
}

async function main() {
  runBuild();

  console.log(
    'verify:strategic-crawl:local: starting astro dev on %s (Vercel adapter has no astro preview)',
    BASE_URL,
  );

  const child = spawn('npx', ['astro', 'dev', '--host', HOST, '--port', PORT], {
    cwd: siteRoot,
    stdio: 'ignore',
    env: { ...process.env },
  });

  const stop = () => {
    try {
      child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  let exitCode = 1;
  try {
    await waitForServer(`${BASE_URL}/`);
    exitCode = runCrawl();
  } finally {
    stop();
    process.off('SIGINT', stop);
    process.off('SIGTERM', stop);
    await new Promise((r) => setTimeout(r, 300));
  }

  process.exit(exitCode === 0 ? 0 : exitCode);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
