import { parse, type HTMLElement } from 'node-html-parser';

export type ParsedNewsHtml = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  body: string[];
  /** Webflow CMS category labels (e.g. `data-cat` on `.category-link`). */
  topics?: string[];
  legacyAuthorRaw?: string;
  heroImage?: { src: string; alt?: string };
};

type ParseErr = { slug: string; error: string };

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function normSpace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

function stripHtmlToText(s: string): string {
  return normSpace(
    s
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' '),
  );
}

function clip(text: string, maxLen: number): string {
  const t = normSpace(text);
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1).trimEnd()}…`;
}

function pickAttr(root: HTMLElement, selector: string, attr: string): string | undefined {
  const node = root.querySelector(selector);
  const v = node?.getAttribute(attr);
  if (!v) return undefined;
  const t = normSpace(v);
  return t || undefined;
}

function absolutizeUrl(url: string, baseOrigin: string): string | undefined {
  const raw = normSpace(url);
  if (!raw) return undefined;
  try {
    const u = new URL(raw, baseOrigin);
    return u.toString();
  } catch {
    return undefined;
  }
}

function titleFromDoc(root: HTMLElement): string | undefined {
  return (
    normSpace(root.querySelector('h1')?.textContent ?? '') ||
    pickAttr(root, 'meta[property="og:title"]', 'content') ||
    pickAttr(root, 'meta[name="twitter:title"]', 'content') ||
    normSpace(root.querySelector('title')?.textContent ?? '')
  );
}

function bodyParagraphsFromDoc(root: HTMLElement): string[] {
  const richCandidates = [
    '.w-richtext p',
    'article p',
    'main p',
    '.main-wrapper p',
    '.post-content p',
    '.blog-content p',
  ];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const sel of richCandidates) {
    const nodes = root.querySelectorAll(sel);
    for (const p of nodes) {
      const text = normSpace(p.textContent || '');
      if (!text) continue;
      if (text.length < 24) continue;
      if (/^(share|read more|posted in|tags?)\b/i.test(text)) continue;
      if (seen.has(text)) continue;
      seen.add(text);
      out.push(text);
    }
    if (out.length >= 2) return out;
  }
  return out;
}

function parseIsoDateFromRaw(raw?: string): string | undefined {
  if (!raw) return undefined;
  const t = normSpace(raw);
  if (!t) return undefined;
  if (ISO_DATE_RE.test(t)) return t;
  const m = t.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

/**
 * Schillings Webflow template: date in `.header-post` only (DD / MM / YYYY), not in `<time>` or `article:published_time`.
 */
function webflowUkDateFromPostHeader(root: HTMLElement): string | undefined {
  const el = root.querySelector('.header-post .post-header-text .post-date');
  if (!el) return undefined;
  const text = normSpace((el.textContent ?? '').replace(/\u00a0/g, ' '));
  const m = text.match(/\b(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})\b/);
  if (!m) return undefined;
  const dd = m[1].padStart(2, '0');
  const mm = m[2].padStart(2, '0');
  const yyyy = m[3];
  const iso = `${yyyy}-${mm}-${dd}`;
  if (!ISO_DATE_RE.test(iso)) return undefined;
  const dt = new Date(`${iso}T12:00:00.000Z`);
  if (Number.isNaN(dt.getTime())) return undefined;
  return iso;
}

function topicsFromWebflowCategories(root: HTMLElement): string[] {
  const links = root.querySelectorAll('.header-post a.category-link');
  const seen = new Set<string>();
  const out: string[] = [];
  for (const a of links) {
    const fromAttr = a.getAttribute('data-cat')?.trim();
    const fromText = normSpace(a.textContent ?? '');
    const label = fromAttr || fromText;
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out;
}

function isWebflowPlaceholderHeroUrl(url: string): boolean {
  return /placeholder\.60f9b1840c\.svg|\/Basic\/assets\/placeholder/i.test(url);
}

function authorFromWebflowPostHeader(root: HTMLElement): string | undefined {
  const el = root.querySelector('.header-post .author-details__inner .text-block-12');
  const t = normSpace(el?.textContent ?? '');
  return t || undefined;
}

function publishedDateFromDoc(root: HTMLElement): string | undefined {
  return (
    parseIsoDateFromRaw(root.querySelector('time')?.getAttribute('datetime')) ||
    parseIsoDateFromRaw(pickAttr(root, 'meta[property="article:published_time"]', 'content')) ||
    parseIsoDateFromRaw(pickAttr(root, 'meta[name="pubdate"]', 'content')) ||
    webflowUkDateFromPostHeader(root)
  );
}

function modifiedDateFromDoc(root: HTMLElement): string | undefined {
  return (
    parseIsoDateFromRaw(pickAttr(root, 'meta[property="article:modified_time"]', 'content')) ||
    parseIsoDateFromRaw(pickAttr(root, 'meta[name="lastmod"]', 'content'))
  );
}

function descriptionFromDoc(root: HTMLElement, body: string[]): string {
  const meta =
    pickAttr(root, 'meta[name="description"]', 'content') ||
    pickAttr(root, 'meta[property="og:description"]', 'content');
  if (meta) return clip(stripHtmlToText(meta), 320);
  if (body[0]) return clip(body[0], 320);
  return '';
}

function authorRawFromDoc(root: HTMLElement): string | undefined {
  const meta = pickAttr(root, 'meta[name="author"]', 'content') || pickAttr(root, 'meta[property="article:author"]', 'content');
  if (meta) return meta;
  const webflowAuthor = authorFromWebflowPostHeader(root);
  if (webflowAuthor) return webflowAuthor;
  const bylineCandidates = [
    '.article-author',
    '.post-author',
    '.news-author',
    '[data-author]',
    '.byline',
  ];
  for (const sel of bylineCandidates) {
    const text = normSpace(root.querySelector(sel)?.textContent ?? '');
    if (!text) continue;
    return text.replace(/^by\s+/i, '').trim();
  }
  return undefined;
}

function heroImageFromDoc(root: HTMLElement, baseOrigin: string, title: string): ParsedNewsHtml['heroImage'] {
  const headerScope = root.querySelector('.header-post');
  if (headerScope) {
    const imgs = headerScope.querySelectorAll('img.post-main-image-inner, .post-main-image img');
    for (const img of imgs) {
      if (img.classList.contains('w-condition-invisible')) continue;
      const raw = img.getAttribute('src');
      if (!raw || isWebflowPlaceholderHeroUrl(raw)) continue;
      const src = absolutizeUrl(raw, baseOrigin);
      if (!src) continue;
      const alt = normSpace(img.getAttribute('alt') || '');
      return { src, alt: alt || title };
    }
  }

  const og = pickAttr(root, 'meta[property="og:image"]', 'content');
  const tw = pickAttr(root, 'meta[name="twitter:image"]', 'content');
  const candidates = [og, tw, pickAttr(root, 'article img', 'src'), pickAttr(root, '.w-richtext img', 'src'), pickAttr(root, 'main img', 'src')];
  for (const raw of candidates) {
    if (!raw || isWebflowPlaceholderHeroUrl(raw)) continue;
    const src = absolutizeUrl(raw, baseOrigin);
    if (!src) continue;
    const alt = normSpace(
      pickAttr(root, 'article img', 'alt') ||
        pickAttr(root, '.w-richtext img', 'alt') ||
        pickAttr(root, 'main img', 'alt') ||
        '',
    );
    return { src, alt: alt || title };
  }
  return undefined;
}

export function parseNewsHtml(html: string, slug: string, baseOrigin: string): ParsedNewsHtml | ParseErr {
  const root = parse(html);
  const title = titleFromDoc(root);
  if (!title) return { slug, error: 'no title' };
  const body = bodyParagraphsFromDoc(root);
  const description = descriptionFromDoc(root, body);
  const datePublished = publishedDateFromDoc(root) ?? '1970-01-01';
  const dateModified = modifiedDateFromDoc(root);
  const topics = topicsFromWebflowCategories(root);
  const legacyAuthorRaw = authorRawFromDoc(root);
  const heroImage = heroImageFromDoc(root, baseOrigin, title);

  return {
    slug,
    title,
    description,
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    body,
    ...(topics.length > 0 ? { topics } : {}),
    ...(legacyAuthorRaw ? { legacyAuthorRaw } : {}),
    ...(heroImage ? { heroImage } : {}),
  };
}

