import { describe, expect, it } from 'vitest';
import { parseNewsHtml } from './news-import-parse';

describe('parseNewsHtml', () => {
  it('extracts title, meta description, date, body, hero and author', () => {
    const html = `<!doctype html><html><head>
      <title>Ignored title</title>
      <meta property="og:title" content="Integrated response in high-stakes matters" />
      <meta name="description" content="Desc from meta." />
      <meta property="article:published_time" content="2026-05-01T12:00:00Z" />
      <meta property="article:modified_time" content="2026-05-02T09:00:00Z" />
      <meta property="og:image" content="/images/hero.jpg" />
      <meta name="author" content="Jane Doe" />
    </head><body>
      <article>
        <p>First paragraph with enough content to pass the parser threshold for migration output.</p>
        <p>Second paragraph with substantive information for article rendering.</p>
      </article>
    </body></html>`;
    const out = parseNewsHtml(html, 'parser-fixture-high-stakes-sample', 'https://schillingspartners.com');
    expect('error' in out).toBe(false);
    if ('error' in out) return;
    expect(out.title).toBe('Integrated response in high-stakes matters');
    expect(out.description).toBe('Desc from meta.');
    expect(out.datePublished).toBe('2026-05-01');
    expect(out.dateModified).toBe('2026-05-02');
    expect(out.body.length).toBeGreaterThanOrEqual(2);
    expect(out.heroImage?.src).toBe('https://schillingspartners.com/images/hero.jpg');
    expect(out.legacyAuthorRaw).toBe('Jane Doe');
  });

  it('falls back description to first paragraph', () => {
    const html = `<html><body><h1>Title</h1><time datetime="2026-03-01"></time><article><p>Lead paragraph fallback used when no meta description exists.</p></article></body></html>`;
    const out = parseNewsHtml(html, 'x', 'https://schillingspartners.com');
    expect('error' in out).toBe(false);
    if ('error' in out) return;
    expect(out.description).toContain('Lead paragraph fallback');
  });

  it('returns no title error when neither h1 nor meta/title exists', () => {
    const out = parseNewsHtml('<html><body><p>No heading</p></body></html>', 'x', 'https://schillingspartners.com');
    expect(out).toEqual({ slug: 'x', error: 'no title' });
  });

  it('falls back datePublished to 1970-01-01 when missing', () => {
    const html = `<html><body><h1>Title</h1><article><p>Body paragraph that is definitely long enough to pass validation threshold.</p></article></body></html>`;
    const out = parseNewsHtml(html, 'x', 'https://schillingspartners.com');
    expect('error' in out).toBe(false);
    if ('error' in out) return;
    expect(out.datePublished).toBe('1970-01-01');
  });

  it('reads Webflow UK post header date (DD / MM / YYYY)', () => {
    const html = `<!doctype html><html><body>
      <section class="header-post"><div class="header-post-inner"><div class="post-header-text">
        <div class="post-date"><span>03</span><span> / </span><span>05</span><span> / </span><span>2022</span></div>
        <h1 class="post-full-heading">Title</h1>
      </div></div></section>
      <article><p>First paragraph with enough content to pass the parser threshold for migration output.</p>
      <p>Second paragraph with substantive information for article rendering.</p></article>
    </body></html>`;
    const out = parseNewsHtml(html, 'x', 'https://schillingspartners.com');
    expect('error' in out).toBe(false);
    if ('error' in out) return;
    expect(out.datePublished).toBe('2022-05-03');
  });

  it('extracts Webflow category-link topics and data-cat', () => {
    const html = `<!doctype html><html><body>
      <section class="header-post"><div class="post-header-text">
        <div class="post-date"><span>11</span><span> / </span><span>07</span><span> / </span><span>2023</span></div>
        <h1 class="post-full-heading">Fake news</h1>
        <div class="author-categories w-dyn-list"><div class="w-dyn-items"><div class="w-dyn-item">
          <a data-cat="Disinformation" href="/news" class="category-link">Disinformation</a>
        </div></div></div>
      </div></section>
      <article><p>First paragraph with enough content to pass the parser threshold for migration output.</p>
      <p>Second paragraph with substantive information for article rendering.</p></article>
    </body></html>`;
    const out = parseNewsHtml(html, 'fake-news', 'https://schillingspartners.com');
    expect('error' in out).toBe(false);
    if ('error' in out) return;
    expect(out.topics).toEqual(['Disinformation']);
    expect(out.datePublished).toBe('2023-07-11');
  });
});

