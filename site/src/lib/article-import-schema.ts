import type { Locale } from '../i18n/config';

export type ArticleImportStatus = 'published' | 'draft' | 'migrated-unreviewed';

export type ImportedArticleRecord = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  /** Optional precise instant (ISO 8601); overrides noon-UTC `datePublished` in JSON-LD when set. */
  publishedAt?: string;
  /** Optional precise instant for `dateModified`; overrides noon-UTC calendar `dateModified` when set. */
  modifiedAt?: string;
  body: string[];
  legacyUrl: string;
  status: ArticleImportStatus;
  heroImage?: { src: string; alt?: string };
  topics?: string[];
  services?: string[];
  legacyAuthorRaw?: string;
  authorSlugs?: string[];
};

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function asRecord(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Article record must be an object.');
  }
  return input as Record<string, unknown>;
}

function readNonEmptyString(obj: Record<string, unknown>, key: string): string {
  const v = obj[key];
  if (typeof v !== 'string' || v.trim() === '') {
    throw new Error(`"${key}" is required and must be a non-empty string.`);
  }
  return v.trim();
}

function readOptionalString(obj: Record<string, unknown>, key: string): string | undefined {
  const v = obj[key];
  if (v == null) return undefined;
  if (typeof v !== 'string') throw new Error(`"${key}" must be a string when present.`);
  const t = v.trim();
  return t === '' ? undefined : t;
}

function assertIsoDate(key: string, value: string): string {
  if (!ISO_DATE_RE.test(value)) {
    throw new Error(`"${key}" must be ISO date YYYY-MM-DD.`);
  }
  return value;
}

function readOptionalIsoDateTime(obj: Record<string, unknown>, key: string): string | undefined {
  const v = readOptionalString(obj, key);
  if (!v) return undefined;
  const t = Date.parse(v);
  if (Number.isNaN(t)) {
    throw new Error(`"${key}" must be a parseable ISO 8601 date-time string.`);
  }
  return new Date(t).toISOString();
}

function assertSlug(value: string): string {
  if (!SLUG_RE.test(value)) throw new Error('"slug" must be lowercase kebab-case.');
  return value;
}

function readStringArray(obj: Record<string, unknown>, key: string, required = false): string[] | undefined {
  const v = obj[key];
  if (v == null && !required) return undefined;
  if (!Array.isArray(v)) throw new Error(`"${key}" must be an array.`);
  const out = v
    .map((x) => {
      if (typeof x !== 'string') throw new Error(`"${key}" entries must be strings.`);
      return x.trim();
    })
    .filter(Boolean);
  if (required && out.length === 0) throw new Error(`"${key}" must contain at least one non-empty string.`);
  return out;
}

function readStatus(obj: Record<string, unknown>): ArticleImportStatus {
  const raw = readNonEmptyString(obj, 'status');
  if (raw === 'published' || raw === 'draft' || raw === 'migrated-unreviewed') return raw;
  throw new Error('"status" must be one of: published, draft, migrated-unreviewed.');
}

function readLocale(obj: Record<string, unknown>): Locale {
  const raw = readNonEmptyString(obj, 'locale');
  if (raw === 'en-gb' || raw === 'en-us' || raw === 'en-ie') return raw;
  throw new Error('"locale" must be one of: en-gb, en-us, en-ie.');
}

function readHeroImage(obj: Record<string, unknown>): ImportedArticleRecord['heroImage'] {
  const raw = obj.heroImage;
  if (raw == null) return undefined;
  const r = asRecord(raw);
  const src = readNonEmptyString(r, 'src');
  const alt = readOptionalString(r, 'alt');
  return { src, ...(alt ? { alt } : {}) };
}

/** Strict parser for article-import pipeline. Throws actionable errors for invalid records. */
export function parseImportedArticleRecord(input: unknown): ImportedArticleRecord {
  const r = asRecord(input);
  const parsed: ImportedArticleRecord = {
    id: readNonEmptyString(r, 'id'),
    slug: assertSlug(readNonEmptyString(r, 'slug')),
    locale: readLocale(r),
    title: readNonEmptyString(r, 'title'),
    description: readNonEmptyString(r, 'description'),
    datePublished: assertIsoDate('datePublished', readNonEmptyString(r, 'datePublished')),
    body: readStringArray(r, 'body', true) as string[],
    legacyUrl: readNonEmptyString(r, 'legacyUrl'),
    status: readStatus(r),
  };
  const dateModified = readOptionalString(r, 'dateModified');
  if (dateModified) parsed.dateModified = assertIsoDate('dateModified', dateModified);
  const publishedAt = readOptionalIsoDateTime(r, 'publishedAt');
  if (publishedAt) parsed.publishedAt = publishedAt;
  const modifiedAt = readOptionalIsoDateTime(r, 'modifiedAt');
  if (modifiedAt) parsed.modifiedAt = modifiedAt;
  const heroImage = readHeroImage(r);
  if (heroImage) parsed.heroImage = heroImage;
  const topics = readStringArray(r, 'topics');
  if (topics) parsed.topics = topics;
  const services = readStringArray(r, 'services');
  if (services) parsed.services = services;
  const legacyAuthorRaw = readOptionalString(r, 'legacyAuthorRaw');
  if (legacyAuthorRaw) parsed.legacyAuthorRaw = legacyAuthorRaw;
  const authorSlugs = readStringArray(r, 'authorSlugs');
  if (authorSlugs) parsed.authorSlugs = authorSlugs;
  return parsed;
}

