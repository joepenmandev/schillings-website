import type { PersonRecognition } from '@/data/people';
import type { Locale } from '../i18n/config';
import { articleDateModifiedIso, articleDatePublishedIso } from './news-datetime';
import { organizationNodeId, websiteNodeId } from './jsonld-entity-ids';
import { absolutePageUrl } from './public-url';

/**
 * ProfilePage + Person JSON-LD aligned with Google Search Central guidance:
 * https://developers.google.com/search/docs/appearance/structured-data/profile-page
 *
 * Supports E-E-A-T by exposing verifiable sameAs URLs, a concise description,
 * and topic signals via knowsAbout (mapped from controlled expertise ids).
 * Person/work WebSite link by `@id` matches `buildSiteWideJsonLdGraph` in Base layout.
 */
export type PersonAuthoredArticleJsonLd = {
  slug: string;
  title: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  dateModified?: string;
  publishedAt?: string;
  modifiedAt?: string;
};

export type PersonProfileJsonLdInput = {
  name: string;
  jobTitle: string;
  pageUrl: string;
  origin: string;
  /** Locale segment, e.g. `en-gb` — ties ProfilePage to locale WebSite node. */
  locale: string;
  /** Plain-text bio summary (keep concise; Google recommends a byline/credential-style description). */
  description: string;
  /** Topic labels (e.g. practice areas). */
  knowsAbout: string[];
  /** Authoritative external profile URLs (LinkedIn, directory profiles, etc.). */
  sameAs: string[];
  imageUrl?: string;
  /** ISO 8601 — ProfilePage `dateModified` (e.g. last import or editorial update). */
  dateModified?: string;
  /** Primary office label (e.g. London) — `workLocation` for entity clarity. */
  office?: string;
  /** Site news pieces credited to this profile (`authorSlugs`); feeds `subjectOf` + `BlogPosting` nodes. */
  authoredArticles?: PersonAuthoredArticleJsonLd[];
};

function articlePageUrl(origin: string, locale: string, slug: string): string {
  return absolutePageUrl(origin, locale as Locale, `news/${slug}`);
}

export function buildPersonProfilePageJsonLd(input: PersonProfileJsonLdInput) {
  const personId = `${input.pageUrl}#person`;
  const profileId = `${input.pageUrl}#profilepage`;
  const orgId = organizationNodeId(input.origin);
  const siteId = websiteNodeId(input.origin, input.locale);

  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': personId,
    name: input.name,
    jobTitle: input.jobTitle,
    description: input.description,
    url: input.pageUrl,
    worksFor: { '@id': orgId },
  };

  if (input.imageUrl) {
    person.image = {
      '@type': 'ImageObject',
      url: input.imageUrl,
      caption: input.name,
    };
  }
  if (input.knowsAbout.length) person.knowsAbout = input.knowsAbout;
  if (input.sameAs.length) person.sameAs = input.sameAs;

  if (input.office?.trim()) {
    person.workLocation = {
      '@type': 'Place',
      name: input.office.trim(),
    };
  }

  const articles = input.authoredArticles ?? [];
  const articleNodes: Record<string, unknown>[] = [];
  if (articles.length > 0) {
    person.subjectOf = articles.map((a) => ({
      '@id': `${articlePageUrl(input.origin, input.locale, a.slug)}#article`,
    }));
    for (const a of articles) {
      const articleUrl = articlePageUrl(input.origin, input.locale, a.slug);
      const dateFields = {
        date: a.date,
        dateModified: a.dateModified,
        publishedAt: a.publishedAt,
        modifiedAt: a.modifiedAt,
      };
      articleNodes.push({
        '@type': 'BlogPosting',
        '@id': `${articleUrl}#article`,
        headline: a.title,
        url: articleUrl,
        datePublished: articleDatePublishedIso(dateFields),
        dateModified: articleDateModifiedIso(dateFields),
        author: { '@id': personId },
        publisher: { '@id': orgId },
        isPartOf: { '@id': siteId },
        mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
      });
    }
  }

  const profilePage: Record<string, unknown> = {
    '@type': 'ProfilePage',
    '@id': profileId,
    url: input.pageUrl,
    name: `${input.name} | Schillings`,
    mainEntity: { '@id': personId },
    isPartOf: { '@id': siteId },
  };
  if (input.dateModified) profilePage.dateModified = input.dateModified;

  return {
    '@context': 'https://schema.org',
    '@graph': [profilePage, person, ...articleNodes],
  };
}

export function clipPlainText(text: string, maxLen: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1).trimEnd()}…`;
}

const TITLE_RECOGNITION_ORDER: Array<Exclude<PersonRecognition['provider'], 'other'>> = [
  'chambers',
  'legal500',
  'spears',
];

const TITLE_RECOGNITION_ABBREV: Record<Exclude<PersonRecognition['provider'], 'other'>, string> = {
  chambers: 'CP',
  legal500: 'L500',
  spears: 'SP',
};

function recognitionTitleSuffix(recognitions: PersonRecognition[] | undefined): string {
  if (!recognitions?.length) return '';
  const seen = new Set<Exclude<PersonRecognition['provider'], 'other'>>();
  for (const r of recognitions) {
    if (r.provider !== 'other') seen.add(r.provider);
  }
  if (seen.size === 0) return '';
  const parts = TITLE_RECOGNITION_ORDER.filter((p) => seen.has(p)).map((p) => TITLE_RECOGNITION_ABBREV[p]);
  return ` · ${parts.join(', ')}`;
}

/**
 * `<title>`: name + truncated role + optional directory abbreviations + brand
 * (keep within typical SERP width).
 */
export function buildPersonPageTitle(
  name: string,
  role: string,
  maxTotal = 62,
  recognitions?: PersonRecognition[],
): string {
  const brand = ' | Schillings';
  const prefix = `${name} — `;
  const suffix = recognitionTitleSuffix(recognitions);
  const maxRole = Math.max(8, maxTotal - brand.length - prefix.length - suffix.length);
  return `${prefix}${clipPlainText(role, maxRole)}${suffix}${brand}`;
}

function recognitionMetaHint(recognitions: PersonRecognition[] | undefined): string {
  if (!recognitions?.length) return '';
  const labels: string[] = [];
  for (const p of TITLE_RECOGNITION_ORDER) {
    if (!recognitions.some((r) => r.provider === p)) continue;
    if (p === 'chambers') labels.push('Chambers and Partners');
    else if (p === 'legal500') labels.push('The Legal 500');
    else labels.push("Spear's");
  }
  if (!labels.length) return '';
  return `Recognised in ${labels.join(', ')}.`;
}

/** Meta description: role, office, expertise labels, bio lead, optional directory line. */
export function buildPersonMetaDescription(
  role: string,
  office: string,
  expertiseLabels: string[],
  firstBioParagraph: string,
  maxLen = 158,
  recognitions?: PersonRecognition[],
): string {
  const exp = expertiseLabels.slice(0, 4).join(', ');
  const lead = clipPlainText(`${role} — ${office}.`, 96);
  const chunks = [lead];
  if (exp) chunks.push(`${exp}.`);
  const dir = recognitionMetaHint(recognitions);
  if (dir) chunks.push(dir);
  const bio = clipPlainText(firstBioParagraph, maxLen);
  if (bio.length > 40) chunks.push(bio);
  return clipPlainText(chunks.join(' '), maxLen);
}
