import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

/**
 * HTTP-level smoke checks against `astro preview` (no browser binary required).
 * Validates HTML/RSS without `page` — works in CI and restricted sandboxes.
 */
test.describe('smoke', () => {
  test('locale home responds with expected content', async ({ request }) => {
    const res = await request.get('/');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('High stakes');
    expect(html).toMatch(/<title[^>]*>[\s\S]*Schillings/i);
  });

  test('home HTML includes Yoshki SRA iframe (CSP frame-src must allow cdn.yoshki.com on Vercel)', async ({
    request,
  }) => {
    const res = await request.get('/');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('https://cdn.yoshki.com/iframe/');
  });

  test('contact page includes form markup', async ({ request }) => {
    const res = await request.get('/contact/');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('Contact us');
    expect(html).toMatch(/<form[\s>]/i);
  });

  test('news RSS is valid XML', async ({ request }) => {
    const res = await request.get('/news/rss.xml/');
    expect(res.ok()).toBeTruthy();
    const ct = res.headers()['content-type'] ?? '';
    expect(ct).toMatch(/rss|xml/i);
    const text = await res.text();
    expect(text).toContain('<rss');
    expect(text).toContain('<channel>');
  });

  test('migration-only news article is noindex (thin placeholder)', async ({ request }) => {
    const sitemapSlugs = JSON.parse(
      readFileSync(new URL('../src/data/news-sitemap-slugs.json', import.meta.url), 'utf8'),
    ) as string[];
    const newsTs = readFileSync(new URL('../src/data/news.ts', import.meta.url), 'utf8');
    const editorialSlugs = new Set(
      [...newsTs.matchAll(/\bslug:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]),
    );
    const imported = JSON.parse(
      readFileSync(new URL('../src/data/news-imported.json', import.meta.url), 'utf8'),
    ) as { slug?: string }[];
    const importedSlugs = new Set(imported.map((r) => r.slug).filter(Boolean) as string[]);
    const migrationSlug = sitemapSlugs.find((s) => !editorialSlugs.has(s) && !importedSlugs.has(s));
    expect(
      migrationSlug,
      'need at least one legacy sitemap slug with no imported row (thin placeholder audit)',
    ).toBeTruthy();
    const res = await request.get(`/news/${migrationSlug}/`);
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toMatch(/noindex|robots['"]\s+content=['"][^'"]*noindex/i);
  });
});
