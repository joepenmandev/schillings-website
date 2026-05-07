/**
 * WebPage-typed JSON-LD for index/marketing routes (schema.org WebPage, AboutPage, ContactPage, CollectionPage).
 * Links to Organization + WebSite via `@id` from `buildSiteWideJsonLdGraph` (Base layout).
 */
import type { Locale } from '../i18n/config';
import { htmlLang } from '../i18n/config';
import type { Office, OfficeSlug } from './offices';
import { OFFICES, officeAddressCountry } from './offices';
import { breadcrumbListGraphNode } from './jsonld-breadcrumbs';
import { organizationNodeId, websiteNodeId } from './jsonld-entity-ids';
import { expertisePathSlug } from './expertise-paths';
import { absolutePageUrl } from './public-url';
import { isExpertiseId } from './service-hubs';
import { isHouseNewsAuthorSlug } from '../data/news-house-author';

export function canonicalPageUrl(origin: string, locale: string, pathSegment: string): string {
  return absolutePageUrl(origin, locale as Locale, pathSegment);
}

export type StandalonePageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';

export function buildPageEntityJsonLd(options: {
  origin: string;
  locale: Locale;
  /** Path after locale, no slashes — empty string for homepage */
  pathSegment: string;
  pageType: StandalonePageType;
  name: string;
  description: string;
  /** Fragment for `@id` (default `webpage`) */
  idFragment?: string;
}): Record<string, unknown> {
  const o = options.origin.replace(/\/$/, '');
  const pageUrl = canonicalPageUrl(o, options.locale, options.pathSegment);
  const frag = options.idFragment ?? 'webpage';
  return {
    '@type': options.pageType,
    '@id': `${pageUrl}#${frag}`,
    url: pageUrl,
    name: options.name,
    description: options.description,
    inLanguage: htmlLang[options.locale],
    isPartOf: { '@id': websiteNodeId(o, options.locale) },
    about: { '@id': organizationNodeId(o) },
  };
}

/** Merge multiple schema nodes (e.g. WebPage + BreadcrumbList + ItemList) into one JSON-LD graph. */
export function buildJsonLdGraph(...nodes: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

/** Append nodes to an existing `@graph` payload (e.g. ProfilePage graph + BreadcrumbList). */
export function extendJsonLdGraph(
  base: { '@context': string; '@graph': Record<string, unknown>[] },
  ...extra: Record<string, unknown>[]
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [...base['@graph'], ...extra],
  };
}

export function buildPeopleDirectoryGraphJsonLd(options: {
  origin: string;
  locale: Locale;
  people: { slug: string; name: string }[];
  pageTitle: string;
  pageDescription: string;
}) {
  const o = options.origin.replace(/\/$/, '');
  const pageUrl = canonicalPageUrl(o, options.locale, 'people');
  const pageId = `${pageUrl}#webpage`;
  const listId = `${pageUrl}#people-itemlist`;
  const sorted = [...options.people].sort((a, b) => a.name.localeCompare(b.name, 'en'));
  const itemListElement = sorted.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Person',
      name: p.name,
      url: absolutePageUrl(o, options.locale, `people/${p.slug}`),
    },
  }));

  const collectionPage: Record<string, unknown> = {
    '@type': 'CollectionPage',
    '@id': pageId,
    url: pageUrl,
    name: options.pageTitle,
    description: options.pageDescription,
    inLanguage: htmlLang[options.locale],
    isPartOf: { '@id': websiteNodeId(o, options.locale) },
    about: { '@id': organizationNodeId(o) },
    mainEntity: { '@id': listId },
  };

  const itemList: Record<string, unknown> = {
    '@type': 'ItemList',
    '@id': listId,
    numberOfItems: itemListElement.length,
    itemListElement,
  };

  return buildJsonLdGraph(collectionPage, itemList);
}

/** Nodes only — merge with `breadcrumbListGraphNode` via `[...nodes['@graph'], crumb]`. */
export function buildPeopleDirectoryGraphNodes(options: {
  origin: string;
  locale: Locale;
  people: { slug: string; name: string }[];
  pageTitle: string;
  pageDescription: string;
}): Record<string, unknown>[] {
  const g = buildPeopleDirectoryGraphJsonLd(options) as { '@graph': Record<string, unknown>[] };
  return [...g['@graph']];
}

/** Expertise index — CollectionPage + ItemList of hub WebPages (`/expertise/`). */
export function buildExpertiseIndexGraphJsonLd(options: {
  origin: string;
  locale: Locale;
  /** Index path segment (e.g. `expertise`). */
  collectionSegment: string;
  /** `pathAfterLocale` overrides full tail under locale (e.g. `expertise` vs `expertise/reputation-privacy`). */
  hubs: { id: string; label: string; pathAfterLocale?: string }[];
  pageTitle: string;
  pageDescription: string;
}) {
  const o = options.origin.replace(/\/$/, '');
  const seg = options.collectionSegment;
  const pageUrl = canonicalPageUrl(o, options.locale, seg);
  const pageId = `${pageUrl}#webpage`;
  const listId = `${pageUrl}#expertise-hubs-itemlist`;
  const itemListElement = options.hubs.map((h, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'WebPage',
      name: h.label,
      url: absolutePageUrl(
        o,
        options.locale,
        h.pathAfterLocale ??
          (isExpertiseId(h.id) ? `${seg}/${expertisePathSlug(h.id)}` : `${seg}/${h.id}`),
      ),
    },
  }));

  const collectionPage: Record<string, unknown> = {
    '@type': 'CollectionPage',
    '@id': pageId,
    url: pageUrl,
    name: options.pageTitle,
    description: options.pageDescription,
    inLanguage: htmlLang[options.locale],
    isPartOf: { '@id': websiteNodeId(o, options.locale) },
    about: { '@id': organizationNodeId(o) },
    mainEntity: { '@id': listId },
  };

  const itemList: Record<string, unknown> = {
    '@type': 'ItemList',
    '@id': listId,
    numberOfItems: itemListElement.length,
    itemListElement,
  };

  return buildJsonLdGraph(collectionPage, itemList);
}

export function buildExpertiseIndexGraphNodes(options: {
  origin: string;
  locale: Locale;
  collectionSegment: string;
  hubs: { id: string; label: string; pathAfterLocale?: string }[];
  pageTitle: string;
  pageDescription: string;
}): Record<string, unknown>[] {
  const g = buildExpertiseIndexGraphJsonLd(options) as { '@graph': Record<string, unknown>[] };
  return [...g['@graph']];
}

/** News listing (first page); articles link to `BlogPosting` URLs for crawl hints. */
export function buildNewsIndexGraphJsonLd(options: {
  origin: string;
  locale: Locale;
  articles: { slug: string; title: string }[];
  pageTitle: string;
  pageDescription: string;
}) {
  const o = options.origin.replace(/\/$/, '');
  const pageUrl = canonicalPageUrl(o, options.locale, 'news');
  const pageId = `${pageUrl}#webpage`;
  const listId = `${pageUrl}#news-itemlist`;
  const itemListElement = options.articles.map((a, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'BlogPosting',
      headline: a.title,
      url: absolutePageUrl(o, options.locale, `news/${a.slug}`),
    },
  }));

  const collectionPage: Record<string, unknown> = {
    '@type': 'CollectionPage',
    '@id': pageId,
    url: pageUrl,
    name: options.pageTitle,
    description: options.pageDescription,
    inLanguage: htmlLang[options.locale],
    isPartOf: { '@id': websiteNodeId(o, options.locale) },
    about: { '@id': organizationNodeId(o) },
    mainEntity: { '@id': listId },
  };

  const itemList: Record<string, unknown> = {
    '@type': 'ItemList',
    '@id': listId,
    numberOfItems: itemListElement.length,
    itemListElement,
  };

  return buildJsonLdGraph(collectionPage, itemList);
}

/** News listing paginated (`/news/page/N/`) — same graph shape as page 1, distinct canonical URL. */
export function buildNewsPaginatedIndexGraphJsonLd(options: {
  origin: string;
  locale: Locale;
  pageNum: number;
  articles: { slug: string; title: string }[];
  pageTitle: string;
  pageDescription: string;
}) {
  const o = options.origin.replace(/\/$/, '');
  const pathSegment = `news/page/${options.pageNum}`;
  const pageUrl = canonicalPageUrl(o, options.locale, pathSegment);
  const pageId = `${pageUrl}#webpage`;
  const listId = `${pageUrl}#news-itemlist`;
  const itemListElement = options.articles.map((a, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'BlogPosting',
      headline: a.title,
      url: absolutePageUrl(o, options.locale, `news/${a.slug}`),
    },
  }));

  const collectionPage: Record<string, unknown> = {
    '@type': 'CollectionPage',
    '@id': pageId,
    url: pageUrl,
    name: options.pageTitle,
    description: options.pageDescription,
    inLanguage: htmlLang[options.locale],
    isPartOf: { '@id': websiteNodeId(o, options.locale) },
    about: { '@id': organizationNodeId(o) },
    mainEntity: { '@id': listId },
  };

  const itemList: Record<string, unknown> = {
    '@type': 'ItemList',
    '@id': listId,
    numberOfItems: itemListElement.length,
    itemListElement,
  };

  return buildJsonLdGraph(collectionPage, itemList);
}

/** News topic hub (`/news/topic/{slug}/`) — `WebPage` when empty, else `CollectionPage` + `ItemList`. */
export function buildNewsTopicHubGraphJsonLd(options: {
  origin: string;
  locale: Locale;
  topicSlug: string;
  articles: { slug: string; title: string }[];
  pageTitle: string;
  pageDescription: string;
}) {
  const o = options.origin.replace(/\/$/, '');
  const pathSegment = `news/topic/${options.topicSlug}`;
  const pageUrl = canonicalPageUrl(o, options.locale, pathSegment);

  if (options.articles.length === 0) {
    return buildJsonLdGraph(
      buildPageEntityJsonLd({
        origin: o,
        locale: options.locale,
        pathSegment,
        pageType: 'WebPage',
        name: options.pageTitle,
        description: options.pageDescription,
        idFragment: 'webpage',
      }),
    );
  }

  const pageId = `${pageUrl}#webpage`;
  const listId = `${pageUrl}#topic-news-itemlist`;
  const itemListElement = options.articles.map((a, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'BlogPosting',
      headline: a.title,
      url: absolutePageUrl(o, options.locale, `news/${a.slug}`),
    },
  }));

  const collectionPage: Record<string, unknown> = {
    '@type': 'CollectionPage',
    '@id': pageId,
    url: pageUrl,
    name: options.pageTitle,
    description: options.pageDescription,
    inLanguage: htmlLang[options.locale],
    isPartOf: { '@id': websiteNodeId(o, options.locale) },
    about: { '@id': organizationNodeId(o) },
    mainEntity: { '@id': listId },
  };

  const itemList: Record<string, unknown> = {
    '@type': 'ItemList',
    '@id': listId,
    numberOfItems: itemListElement.length,
    itemListElement,
  };

  return buildJsonLdGraph(collectionPage, itemList);
}

export function buildNewsTopicHubGraphNodes(options: {
  origin: string;
  locale: Locale;
  topicSlug: string;
  articles: { slug: string; title: string }[];
  pageTitle: string;
  pageDescription: string;
}): Record<string, unknown>[] {
  const g = buildNewsTopicHubGraphJsonLd(options) as { '@graph': Record<string, unknown>[] };
  return [...g['@graph']];
}

/** News author archive (`/news/author/{slug}/`) — same graph shape as topic hub. */
export function buildNewsAuthorHubGraphJsonLd(options: {
  origin: string;
  locale: Locale;
  authorSlug: string;
  articles: { slug: string; title: string }[];
  pageTitle: string;
  pageDescription: string;
}) {
  const o = options.origin.replace(/\/$/, '');
  const pathSegment = `news/author/${options.authorSlug}`;
  const pageUrl = canonicalPageUrl(o, options.locale, pathSegment);

  if (options.articles.length === 0) {
    return buildJsonLdGraph(
      buildPageEntityJsonLd({
        origin: o,
        locale: options.locale,
        pathSegment,
        pageType: 'WebPage',
        name: options.pageTitle,
        description: options.pageDescription,
        idFragment: 'webpage',
      }),
    );
  }

  const pageId = `${pageUrl}#webpage`;
  const listId = `${pageUrl}#author-news-itemlist`;
  const itemListElement = options.articles.map((a, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'BlogPosting',
      headline: a.title,
      url: absolutePageUrl(o, options.locale, `news/${a.slug}`),
    },
  }));

  const authorEntityRef = isHouseNewsAuthorSlug(options.authorSlug)
    ? { '@id': organizationNodeId(o) }
    : {
        '@id': `${absolutePageUrl(o, options.locale, `people/${options.authorSlug}`)}#person`,
      };

  const collectionPage: Record<string, unknown> = {
    '@type': 'CollectionPage',
    '@id': pageId,
    url: pageUrl,
    name: options.pageTitle,
    description: options.pageDescription,
    inLanguage: htmlLang[options.locale],
    isPartOf: { '@id': websiteNodeId(o, options.locale) },
    about: { '@id': organizationNodeId(o) },
    /** Person profile `@id`, or the firm `Organization` for the synthetic Schillings byline hub. */
    author: authorEntityRef,
    mainEntity: { '@id': listId },
  };

  const itemList: Record<string, unknown> = {
    '@type': 'ItemList',
    '@id': listId,
    numberOfItems: itemListElement.length,
    itemListElement,
  };

  return buildJsonLdGraph(collectionPage, itemList);
}

export function buildNewsAuthorHubGraphNodes(options: {
  origin: string;
  locale: Locale;
  authorSlug: string;
  articles: { slug: string; title: string }[];
  pageTitle: string;
  pageDescription: string;
}): Record<string, unknown>[] {
  const g = buildNewsAuthorHubGraphJsonLd(options) as { '@graph': Record<string, unknown>[] };
  return [...g['@graph']];
}

export function buildOfficeLocalBusinessJsonLd(options: {
  origin: string;
  locale: Locale;
  office: Office;
}): Record<string, unknown> {
  const o = options.origin.replace(/\/$/, '');
  const pageUrl = canonicalPageUrl(o, options.locale, options.office.slug);
  const lines = [...options.office.addressLines];
  const streetAddress = lines.length > 1 ? lines.slice(0, -1).join(', ') : (lines[0] ?? '');
  return {
    '@type': 'LocalBusiness',
    '@id': `${pageUrl}#office`,
    name: `Schillings — ${options.office.cityLabel}`,
    url: pageUrl,
    image: `${o}/brand/schillings-logo-rgb.svg`,
    telephone: options.office.phoneDisplay,
    email: options.office.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: options.office.cityLabel,
      addressCountry: officeAddressCountry(options.office.slug),
    },
    parentOrganization: { '@id': organizationNodeId(o) },
  };
}

/** AboutPage + BreadcrumbList + LocalBusiness for the regional office (same LocalBusiness `@id` as the office contact URL). */
export function buildAboutUsPageJsonLd(options: {
  origin: string;
  locale: Locale;
  pageTitle: string;
  pageDescription: string;
  officeSlug: OfficeSlug;
  breadcrumbItems: { name: string; item: string }[];
}) {
  const office = OFFICES[options.officeSlug];
  return buildJsonLdGraph(
    buildPageEntityJsonLd({
      origin: options.origin,
      locale: options.locale,
      pathSegment: 'about-us',
      pageType: 'AboutPage',
      name: options.pageTitle,
      description: options.pageDescription,
    }),
    breadcrumbListGraphNode(options.breadcrumbItems),
    buildOfficeLocalBusinessJsonLd({ origin: options.origin, locale: options.locale, office }),
  );
}
