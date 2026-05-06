import type { NewsArticle } from '../data/news';
import { getPersonBySlug } from '../data/people';

export type NewsListAuthorEntry =
  | { type: 'profile'; slug: string; name: string; role: string; imagePath?: string }
  | { type: 'credit'; name: string };

/**
 * Authors to show on news archive cards — profiles link to bios + author hubs; plain credit for legacy-only lines.
 */
export function newsListAuthorEntries(article: NewsArticle): NewsListAuthorEntry[] {
  const slugs = (article.authorSlugs ?? []).map((s) => s.trim()).filter(Boolean);
  const rawFallback = (article.legacyAuthorRaw ?? '').trim();

  if (slugs.length === 0) {
    return rawFallback ? [{ type: 'credit', name: rawFallback }] : [];
  }

  const out: NewsListAuthorEntry[] = [];
  for (const slug of slugs) {
    const p = getPersonBySlug(slug);
    if (p) {
      out.push({ type: 'profile', slug, name: p.name, role: p.role, imagePath: p.imagePath });
    }
  }

  if (out.length === 0 && rawFallback) {
    return [{ type: 'credit', name: rawFallback }];
  }
  return out;
}

/** Section heading for related analysis by the same credited author(s). */
export function latestPostsByAuthorsSectionTitle(entries: NewsListAuthorEntry[]): string {
  const names = entries.map((e) => e.name);
  if (names.length === 0) return 'Further reading';
  if (names.length === 1) return `Further analysis from ${names[0]}`;
  if (names.length === 2) return `Further analysis from ${names[0]} and ${names[1]}`;
  return `Further analysis from ${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}
