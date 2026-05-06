import { test, expect } from '@playwright/test';

/**
 * Tier 2 — Locale homes, HTML sitemaps, footer region links, hreflang on UK home.
 */
test.describe('locale, sitemap, region', () => {
  test('locale homes return 200', async ({ request }) => {
    for (const path of ['/', '/us/', '/ie/']) {
      const res = await request.get(path);
      expect(res.ok(), path).toBeTruthy();
    }
  });

  test('HTML sitemap pages return 200', async ({ request }) => {
    for (const path of ['/sitemap/', '/us/sitemap/', '/ie/sitemap/']) {
      const res = await request.get(path);
      expect(res.ok(), path).toBeTruthy();
      const html = await res.text();
      expect(html).toMatch(/sitemap/i);
    }
  });

  test('UK home includes hreflang cluster and x-default matches en-GB', async ({ request }) => {
    const res = await request.get('/');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toMatch(/hreflang=["']en-GB["']/i);
    expect(html).toMatch(/hreflang=["']en-US["']/i);
    expect(html).toMatch(/hreflang=["']en-IE["']/i);
    expect(html).toMatch(/hreflang=["']x-default["']/i);

    const enGb = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]*hreflang=["']en-GB["'][^>]*>/gi)];
    const xDef = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]*hreflang=["']x-default["'][^>]*>/gi)];
    expect(enGb.length).toBeGreaterThan(0);
    expect(xDef.length).toBeGreaterThan(0);
    const gbHref = enGb[0][0].match(/href=["']([^"']+)["']/i)?.[1];
    const xdHref = xDef[0][0].match(/href=["']([^"']+)["']/i)?.[1];
    expect(gbHref).toBeTruthy();
    expect(xdHref).toBe(gbHref);
  });

  test('contact page includes region links to other locales', async ({ request }) => {
    const res = await request.get('/contact/');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('/us/contact/');
    expect(html).toContain('/ie/contact/');
    expect(html).toMatch(/aria-label=["']Choose region["']/i);
  });
});
