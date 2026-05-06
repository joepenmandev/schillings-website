import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import {
  indexableNewsAndPeopleAbsoluteUrls,
  isExcludedPeopleProfileFromSitemap,
  isThinMigrationNewsPath,
} from './src/build/sitemap-news-people';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

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
      customPages: indexableNewsAndPeopleAbsoluteUrls(siteUrl),
      // Exclude non-canonical or thin migration URLs.
      filter: (page) => {
        try {
          const pathname = new URL(page).pathname.replace(/\/$/, '') || '/';
          if (page.includes('/draft/')) return false;
          // Utility pages are noindex — omit from XML sitemap (SF "non-indexable in sitemap", checklist §C).
          if (pathname === '/search' || pathname === '/us/search' || pathname === '/ie/search') return false;
          if (
            pathname === '/contact/thank-you' ||
            pathname === '/us/contact/thank-you' ||
            pathname === '/ie/contact/thank-you'
          ) {
            return false;
          }
          if (isThinMigrationNewsPath(pathname)) return false;
          if (isExcludedPeopleProfileFromSitemap(page)) return false;
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
