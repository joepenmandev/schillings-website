/**
 * BlogPosting JSON-LD with explicit Person nodes for E-E-A-T (stable @id alignment with ProfilePage).
 * @see https://developers.google.com/search/docs/appearance/structured-data/article
 */
import type { NewsArticle } from '../data/news';
import type { PersonProfile } from '../data/people';
import type { Locale } from '../i18n/config';
import { htmlLang } from '../i18n/config';
import { absoluteOgImageUrl } from './absolute-media-url';
import { organizationNodeId, websiteNodeId, normalizeOrigin } from './jsonld-entity-ids';
import { articleDateModifiedIso, articleDatePublishedIso } from './news-datetime';

/** Rich-result article images should be crawlable raster formats, not SVG-only. */
function isSvgImageUrl(url: string): boolean {
  const s = url.trim();
  try {
    return new URL(s).pathname.toLowerCase().endsWith('.svg');
  } catch {
    return /\.svg(\?|#|$)/i.test(s);
  }
}
import { firstNonemptyParagraphIndex, newsHeroDisplaySrc } from './news-render';
import { clipPlainText } from './person-jsonld';
import { absolutePageUrl } from './public-url';

export type ResolvePerson = (slug: string) => PersonProfile | null;

function personProfilePageUrl(origin: string, locale: Locale, slug: string): string {
  return absolutePageUrl(normalizeOrigin(origin), locale, `people/${slug}`);
}

/**
 * Single script: Person node(s) + BlogPosting, all cross-linked with @id.
 */
export function buildNewsArticleBlogPostingGraph(options: {
  origin: string;
  locale: Locale;
  article: NewsArticle;
  pageUrl: string;
  resolvePerson: ResolvePerson;
}): { '@context': string; '@graph': Record<string, unknown>[] } {
  const { origin, locale, article, pageUrl, resolvePerson } = options;
  const o = normalizeOrigin(origin);
  const orgId = organizationNodeId(o);
  const siteId = websiteNodeId(o, locale);
  const articleId = `${pageUrl}#article`;
  const imageSrc = newsHeroDisplaySrc(article);
  const imageUrl = imageSrc ? absoluteOgImageUrl(o, imageSrc) : undefined;

  const slugs = (article.authorSlugs ?? []).map((s) => s.trim()).filter(Boolean);
  const personNodes: Record<string, unknown>[] = [];
  const authorRefs: Record<string, unknown>[] = [];

  for (const slug of slugs) {
    const p = resolvePerson(slug);
    if (!p) continue;
    const purl = personProfilePageUrl(o, locale, slug);
    const pid = `${purl}#person`;
    const node: Record<string, unknown> = {
      '@type': 'Person',
      '@id': pid,
      name: p.name,
      url: purl,
      jobTitle: p.role,
      worksFor: { '@id': orgId },
    };
    if (p.imagePath) {
      node.image = {
        '@type': 'ImageObject',
        url: `${o}${p.imagePath.startsWith('/') ? p.imagePath : `/${p.imagePath}`}`,
        caption: p.name,
      };
    }
    if (p.sameAs?.length) node.sameAs = p.sameAs;
    const bioPlain = p.paragraphs.join(' ').replace(/\s+/g, ' ').trim();
    if (bioPlain) {
      node.description = clipPlainText(bioPlain, 600);
    }
    personNodes.push(node);
    authorRefs.push({ '@id': pid });
  }

  const raw = (article.legacyAuthorRaw ?? '').trim();
  if (authorRefs.length === 0 && raw) {
    authorRefs.push({ '@type': 'Person', name: raw });
  }

  const publisherRef = { '@id': orgId };
  const authorField: Record<string, unknown> | Record<string, unknown>[] =
    authorRefs.length === 0
      ? publisherRef
      : authorRefs.length === 1
        ? authorRefs[0]
        : authorRefs;

  const blogPosting: Record<string, unknown> = {
    '@type': 'BlogPosting',
    '@id': articleId,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    headline: article.title,
    description: article.description,
    datePublished: articleDatePublishedIso(article),
    dateModified: articleDateModifiedIso(article),
    url: pageUrl,
    inLanguage: htmlLang[locale],
    author: authorField,
    publisher: publisherRef,
    copyrightHolder: publisherRef,
    isPartOf: { '@id': siteId },
  };

  const topics = article.topics?.filter((t) => t.trim()) ?? [];
  if (topics.length > 0) {
    blogPosting.articleSection = topics[0];
    if (topics.length > 1) blogPosting.keywords = topics.join(', ');
  }

  if (imageUrl && !isSvgImageUrl(imageUrl)) {
    blogPosting.image = {
      '@type': 'ImageObject',
      url: imageUrl,
      caption: article.title,
    };
  }

  const ledeIx = firstNonemptyParagraphIndex(article.paragraphs);
  blogPosting.speakable = {
    '@type': 'SpeakableSpecification',
    cssSelector:
      ledeIx >= 0 ? ['#article-headline', '#article-lede'] : ['#article-headline'],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [...personNodes, blogPosting],
  };
}
