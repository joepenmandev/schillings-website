/**
 * Scan src/pages for static index.astro routes (skip paths under dynamic [param] folders).
 * Returns Record<locale, Set<tail>> where tail is path after locale prefix ('' = home).
 */
import { readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

/** @param {string} pagesRoot absolute path to src/pages */
export async function scanStaticRouteTailsByLocale(pagesRoot) {
  /** @type {Record<string, Set<string>>} */
  const result = {
    'en-gb': new Set(),
    'en-us': new Set(),
    'en-ie': new Set(),
  };

  /** @param {string} dir */
  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      if (ent.name.startsWith('.')) continue;
      const p = join(dir, ent.name);
      const relFromPages = relative(pagesRoot, p).replace(/\\/g, '/');
      if (relFromPages.split('/').some((seg) => seg.startsWith('[') && seg.endsWith(']'))) {
        continue;
      }
      if (ent.isDirectory()) {
        await walk(p);
      } else if (ent.name === 'index.astro') {
        const dirRel = dirname(relFromPages);
        const parsed = parsePagesSubpath(dirRel === '.' ? '' : dirRel);
        if (parsed) {
          result[parsed.locale].add(parsed.tail);
        }
      }
    }
  }

  await walk(pagesRoot);
  return result;
}

/**
 * @param {string} subpath path under pages/ without trailing /index.astro (e.g. '', 'contact', 'us/contact')
 */
export function parsePagesSubpath(subpath) {
  const rest = subpath.replace(/\\/g, '/');
  if (rest === '' || rest === '.') {
    return { locale: 'en-gb', tail: '' };
  }
  if (rest === 'us' || rest.startsWith('us/')) {
    return { locale: 'en-us', tail: rest === 'us' ? '' : rest.slice('us/'.length) };
  }
  if (rest === 'ie' || rest.startsWith('ie/')) {
    return { locale: 'en-ie', tail: rest === 'ie' ? '' : rest.slice('ie/'.length) };
  }
  return { locale: 'en-gb', tail: rest };
}
