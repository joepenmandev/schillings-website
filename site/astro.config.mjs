// @ts-check
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

const newsSitemapSlugs = JSON.parse(
  readFileSync(fileURLToPath(new URL('./src/data/news-sitemap-slugs.json', import.meta.url)), 'utf8'),
);
const newsTs = readFileSync(fileURLToPath(new URL('./src/data/news.ts', import.meta.url)), 'utf8');
const publishedNewsSlugs = new Set([...newsTs.matchAll(/\bslug:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]));
const newsImported = JSON.parse(
  readFileSync(fileURLToPath(new URL('./src/data/news-imported.json', import.meta.url)), 'utf8'),
);
for (const row of newsImported) {
  if (
    row &&
    (row.status === 'published' || row.status === 'migrated-unreviewed') &&
    typeof row.slug === 'string'
  ) {
    publishedNewsSlugs.add(row.slug);
  }
}

const peopleSitemapSlugs = JSON.parse(
  readFileSync(fileURLToPath(new URL('./src/data/people-sitemap-slugs.json', import.meta.url)), 'utf8'),
);
const peopleImported = JSON.parse(
  readFileSync(fileURLToPath(new URL('./src/data/people-imported.json', import.meta.url)), 'utf8'),
);
const publishedPeopleSlugs = new Set(peopleImported.map((p) => p.slug));

function isThinMigrationNewsPath(pathname) {
  const prefixed = pathname.match(/^\/(us|ie)\/news\/([^/]+)$/);
  if (prefixed) {
    const slug = prefixed[2];
    return newsSitemapSlugs.includes(slug) && !publishedNewsSlugs.has(slug);
  }
  const gb = pathname.match(/^\/news\/([^/]+)$/);
  if (gb) {
    const slug = gb[1];
    if (slug === 'rss.xml') return false;
    return newsSitemapSlugs.includes(slug) && !publishedNewsSlugs.has(slug);
  }
  return false;
}

function isThinMigrationPeoplePath(pathname) {
  const prefixed = pathname.match(/^\/(us|ie)\/people\/([^/]+)$/);
  if (prefixed) {
    const slug = prefixed[2];
    return peopleSitemapSlugs.includes(slug) && !publishedPeopleSlugs.has(slug);
  }
  const gb = pathname.match(/^\/people\/([^/]+)$/);
  if (gb) {
    const slug = gb[1];
    return peopleSitemapSlugs.includes(slug) && !publishedPeopleSlugs.has(slug);
  }
  return false;
}

const siteUrl =
  process.env.PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  output: 'server',
  adapter: vercel(),
  trailingSlash: 'always',
  /** Folder + `index.html` per route — public URLs are `/path/` (no `.html` in the path). */
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      // Exclude non-canonical or thin migration URLs.
      filter: (page) => {
        try {
          const path = new URL(page).pathname.replace(/\/$/, '') || '/';
          if (page.includes('/draft/')) return false;
          // Utility pages are noindex — omit from XML sitemap (SF "non-indexable in sitemap", checklist §C).
          if (path === '/search' || path === '/us/search' || path === '/ie/search') return false;
          if (
            path === '/contact/thank-you' ||
            path === '/us/contact/thank-you' ||
            path === '/ie/contact/thank-you'
          ) {
            return false;
          }
          if (isThinMigrationNewsPath(path)) return false;
          if (isThinMigrationPeoplePath(path)) return false;
          return true;
        } catch {
          return true;
        }
      },
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(srcDir),
      },
    },
    plugins: [tailwindcss()],
  },
});
