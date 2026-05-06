import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const siteDir = fileURLToPath(new URL('../..', import.meta.url));
const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));

function stripTrailingSlashes(p: string): string {
  if (p === '/' || p === '') return '/';
  return p.replace(/\/+$/, '') || '/';
}

function pathMatchesVercelSource(path: string, source: string): boolean {
  const p = stripTrailingSlashes(path);
  const s = stripTrailingSlashes(source);
  if (source.includes(':path*')) {
    const base = stripTrailingSlashes(source.replace(/:path\*$/, ''));
    return p === base || p.startsWith(`${base}/`);
  }
  return p === s;
}

function loadVercelRedirectSources(): string[] {
  const raw = readFileSync(`${siteDir}/vercel.json`, 'utf8');
  const json = JSON.parse(raw) as { redirects: { source: string }[] };
  return json.redirects.map((r) => r.source);
}

function parseRedirectMapPaths(): { oldPath: string; newPath: string }[] {
  const csv = readFileSync(`${repoRoot}/redirect-map.csv`, 'utf8');
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() && !l.startsWith('old_url'));
  const rows: { oldPath: string; newPath: string }[] = [];
  for (const line of lines) {
    const m = line.match(/^(https:\/\/[^,]+),(https:\/\/[^,]+),/);
    if (!m) continue;
    try {
      rows.push({
        oldPath: new URL(m[1]).pathname,
        newPath: new URL(m[2]).pathname,
      });
    } catch {
      /* skip malformed */
    }
  }
  return rows;
}

describe('audit: redirect-map.csv vs site/vercel.json', () => {
  it('every CSV old path is covered by at least one Vercel redirect source pattern', () => {
    const sources = loadVercelRedirectSources();
    const rows = parseRedirectMapPaths();
    expect(rows.length).toBeGreaterThan(10);
    for (const { oldPath } of rows) {
      const hit = sources.some((src) => pathMatchesVercelSource(oldPath, src));
      expect(hit, `No vercel redirect matches CSV old path: ${oldPath}`).toBe(true);
    }
  });

  it('CSV new_url paths align with vercel destinations for non-wildcard rules (spot-check)', () => {
    const raw = readFileSync(`${siteDir}/vercel.json`, 'utf8');
    const json = JSON.parse(raw) as {
      redirects: { source: string; destination: string }[];
    };
    const staticRules = json.redirects.filter((r) => !r.source.includes(':path*'));
    const rows = parseRedirectMapPaths();
    const byOld = new Map(rows.map((r) => [stripTrailingSlashes(r.oldPath), r.newPath]));

    for (const { source, destination } of staticRules) {
      const key = stripTrailingSlashes(source);
      const expectedNew = byOld.get(key);
      if (!expectedNew) continue;
      const destNorm = stripTrailingSlashes(destination);
      const newNorm = stripTrailingSlashes(expectedNew);
      expect(
        destNorm,
        `vercel ${source} → ${destination} but redirect-map new_url path is ${expectedNew}`,
      ).toBe(newNorm);
    }
  });
});
