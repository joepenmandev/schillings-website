import type { NewsArticle } from '../data/news';

/** URL segment for `/{locale}/news/topic/{slug}/` — stable, lowercase, kebab-case. */
export function topicSlugFromLabel(label: string): string {
  const s = label
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return s || 'topic';
}

/** Published articles whose imported topic labels map to this topic slug. */
export function articlesMatchingTopicSlug(articles: NewsArticle[], topicSlug: string): NewsArticle[] {
  return articles.filter((a) =>
    (a.topics ?? []).some((t) => topicSlugFromLabel(t) === topicSlug),
  );
}

/** Distinct topic labels → slug for nav and static paths (first label wins per slug). */
export function uniqueTopicEntriesFromArticles(articles: NewsArticle[]): { slug: string; label: string }[] {
  const bySlug = new Map<string, string>();
  for (const a of articles) {
    for (const t of a.topics ?? []) {
      const label = t.trim();
      if (!label) continue;
      const slug = topicSlugFromLabel(label);
      if (!bySlug.has(slug)) bySlug.set(slug, label);
    }
  }
  return [...bySlug.entries()]
    .map(([slug, label]) => ({ slug, label }))
    .sort((x, y) => x.label.localeCompare(y.label, 'en-gb'));
}
