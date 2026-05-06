import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const siteDir = fileURLToPath(new URL('../..', import.meta.url));

function cspFromVercel(): string {
  const raw = readFileSync(`${siteDir}/vercel.json`, 'utf8');
  const json = JSON.parse(raw) as {
    headers?: { headers: { key: string; value: string }[] }[];
  };
  const block = json.headers?.find((h) =>
    h.headers?.some((x) => x.key === 'Content-Security-Policy'),
  );
  const csp = block?.headers.find((x) => x.key === 'Content-Security-Policy')?.value;
  if (!csp) throw new Error('Missing Content-Security-Policy in vercel.json');
  return csp;
}

function frameSrcOrigins(csp: string): string[] {
  const m = csp.match(/frame-src\s+([^;]+)/i);
  if (!m) throw new Error('CSP missing frame-src');
  return m[1]
    .trim()
    .split(/\s+/)
    .filter((t) => t.startsWith('https://'))
    .map((t) => {
      try {
        return new URL(t).origin;
      } catch {
        return '';
      }
    })
    .filter(Boolean);
}

function httpsIframeOriginsFromAstro(relFromSiteSrc: string): Set<string> {
  const text = readFileSync(`${siteDir}/src/${relFromSiteSrc}`, 'utf8');
  const re = /<iframe[^>]*\bsrc=["']([^"']+)["']/gi;
  const origins = new Set<string>();
  for (const m of text.matchAll(re)) {
    const u = new URL(m[1]);
    if (u.protocol === 'https:') origins.add(u.origin);
  }
  return origins;
}

describe('audit: CSP vs SRA iframe (Vercel)', () => {
  it('allows every https iframe origin declared in SiteFooter and office maps', () => {
    const origins = new Set<string>();
    for (const o of httpsIframeOriginsFromAstro('components/SiteFooter.astro')) origins.add(o);
    for (const o of httpsIframeOriginsFromAstro('components/OfficeMapFrame.astro')) origins.add(o);
    expect(origins.size, 'expected at least one https iframe in audited components').toBeGreaterThan(0);
    const allowed = new Set(frameSrcOrigins(cspFromVercel()));
    for (const o of origins) {
      expect(allowed.has(o), `frame-src must allow ${o} (footer badge / maps)`).toBe(true);
    }
  });

  it('includes upgrade-insecure-requests and restricts object-src', () => {
    const csp = cspFromVercel();
    expect(csp).toMatch(/upgrade-insecure-requests/i);
    expect(csp).toMatch(/object-src\s+'none'/i);
  });
});
