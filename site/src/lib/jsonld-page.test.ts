import { describe, expect, it } from 'vitest';
import {
  buildAboutUsPageJsonLd,
  buildJsonLdGraph,
  buildPageEntityJsonLd,
  canonicalPageUrl,
  buildPeopleDirectoryGraphJsonLd,
  buildNewsPaginatedIndexGraphJsonLd,
  buildNewsTopicHubGraphJsonLd,
  buildNewsAuthorHubGraphJsonLd,
  buildExpertiseIndexGraphJsonLd,
  extendJsonLdGraph,
} from './jsonld-page';

describe('jsonld-page', () => {
  it('buildAboutUsPageJsonLd merges AboutPage, BreadcrumbList, and LocalBusiness', () => {
    const g = buildAboutUsPageJsonLd({
      origin: 'https://x.com',
      locale: 'en-ie',
      pageTitle: 'About IE',
      pageDescription: 'Desc',
      officeSlug: 'dublin',
      breadcrumbItems: [
        { name: 'Home', item: 'https://x.com/ie/' },
        { name: 'About', item: 'https://x.com/ie/about-us/' },
      ],
    }) as { '@graph': { '@type': string }[] };
    const types = g['@graph'].map((n) => n['@type']);
    expect(types).toContain('AboutPage');
    expect(types).toContain('BreadcrumbList');
    expect(types).toContain('LocalBusiness');
  });

  it('canonicalPageUrl includes trailing slash on locale roots', () => {
    expect(canonicalPageUrl('https://x.com', 'en-gb', '')).toBe('https://x.com/');
    expect(canonicalPageUrl('https://x.com/', 'en-us', 'contact')).toBe('https://x.com/us/contact/');
  });

  it('buildPageEntityJsonLd links WebSite and Organization', () => {
    const node = buildPageEntityJsonLd({
      origin: 'https://x.com',
      locale: 'en-gb',
      pathSegment: 'about-us',
      pageType: 'AboutPage',
      name: 'About | Schillings',
      description: 'About copy.',
    }) as Record<string, unknown>;
    expect(node['@type']).toBe('AboutPage');
    expect(node.url).toBe('https://x.com/about-us/');
    expect((node.isPartOf as { '@id': string })['@id']).toBe('https://x.com/#website');
    expect((node.about as { '@id': string })['@id']).toBe('https://x.com/#organization');
  });

  it('people directory graph includes CollectionPage and ItemList', () => {
    const g = buildPeopleDirectoryGraphJsonLd({
      origin: 'https://x.com',
      locale: 'en-gb',
      people: [
        { slug: 'b', name: 'B' },
        { slug: 'a', name: 'A' },
      ],
      pageTitle: 'People | Schillings',
      pageDescription: 'Desc.',
    }) as { '@graph': Record<string, unknown>[] };
    expect(g['@graph']).toHaveLength(2);
    expect(g['@graph'][0]['@type']).toBe('CollectionPage');
    expect(g['@graph'][1]['@type']).toBe('ItemList');
    const list = g['@graph'][1] as { itemListElement: { item: { name: string } }[] };
    expect(list.itemListElement[0].item.name).toBe('A');
    expect(list.itemListElement[1].item.name).toBe('B');
  });

  it('expertise index graph lists hub WebPages', () => {
    const g = buildExpertiseIndexGraphJsonLd({
      origin: 'https://x.com',
      locale: 'en-gb',
      collectionSegment: 'expertise',
      hubs: [{ id: 'reputation_privacy', label: 'Reputation & privacy' }],
      pageTitle: 'Expertise | Schillings',
      pageDescription: 'Desc.',
    }) as { '@graph': Record<string, unknown>[] };
    expect(g['@graph'][1]).toMatchObject({
      numberOfItems: 1,
    });
    const list = g['@graph'][1] as { itemListElement: { item: { url: string } }[] };
    expect(list.itemListElement[0].item.url).toBe('https://x.com/expertise/reputation-privacy/');
  });

  it('expertise index graph respects pathAfterLocale for index-only items', () => {
    const g = buildExpertiseIndexGraphJsonLd({
      origin: 'https://x.com',
      locale: 'en-gb',
      collectionSegment: 'expertise',
      hubs: [
        { id: 'crisis_response', label: 'Crisis Response', pathAfterLocale: 'expertise' },
        {
          id: 'reputation_privacy',
          label: 'Reputation & Defamation',
          pathAfterLocale: 'expertise/reputation-privacy',
        },
      ],
      pageTitle: 'Expertise | Schillings',
      pageDescription: 'Desc.',
    }) as {
      '@graph': Record<string, unknown>[];
    };
    const list = g['@graph'][1] as {
      itemListElement: { item: { url: string } }[];
    };
    expect(list.itemListElement[0].item.url).toBe('https://x.com/expertise/');
    expect(list.itemListElement[1].item.url).toBe('https://x.com/expertise/reputation-privacy/');
  });

  it('buildJsonLdGraph merges nodes', () => {
    const g = buildJsonLdGraph({ '@type': 'Thing', name: 'x' }, { '@type': 'Thing', name: 'y' }) as {
      '@graph': unknown[];
    };
    expect(g['@graph']).toHaveLength(2);
  });

  it('extendJsonLdGraph appends nodes', () => {
    const base = buildJsonLdGraph({ '@type': 'Person', name: 'A' }) as {
      '@context': string;
      '@graph': Record<string, unknown>[];
    };
    const out = extendJsonLdGraph(base, { '@type': 'BreadcrumbList', itemListElement: [] });
    expect(out['@graph']).toHaveLength(2);
  });

  it('news topic hub with articles is CollectionPage + ItemList', () => {
    const g = buildNewsTopicHubGraphJsonLd({
      origin: 'https://x.com',
      locale: 'en-gb',
      topicSlug: 'disinformation',
      articles: [{ slug: 'a-story', title: 'A Story' }],
      pageTitle: 'Disinformation — News',
      pageDescription: 'Desc.',
    }) as { '@graph': Record<string, unknown>[] };
    expect(g['@graph']).toHaveLength(2);
    expect(g['@graph'][0]['@type']).toBe('CollectionPage');
    expect((g['@graph'][0] as { url: string }).url).toBe('https://x.com/news/topic/disinformation/');
    expect(g['@graph'][1]['@type']).toBe('ItemList');
  });

  it('news paginated index uses CollectionPage URL with page segment', () => {
    const g = buildNewsPaginatedIndexGraphJsonLd({
      origin: 'https://x.com',
      locale: 'en-gb',
      pageNum: 3,
      articles: [{ slug: 'a', title: 'A' }],
      pageTitle: 'News — Page 3',
      pageDescription: 'Desc.',
    }) as { '@graph': Record<string, unknown>[] };
    expect(g['@graph'][0]['@type']).toBe('CollectionPage');
    expect((g['@graph'][0] as { url: string }).url).toBe('https://x.com/news/page/3/');
    expect(g['@graph'][1]['@type']).toBe('ItemList');
  });

  it('news topic hub without articles is a single WebPage', () => {
    const g = buildNewsTopicHubGraphJsonLd({
      origin: 'https://x.com',
      locale: 'en-gb',
      topicSlug: 'disinformation',
      articles: [],
      pageTitle: 'Disinformation — News',
      pageDescription: 'Desc.',
    }) as { '@graph': Record<string, unknown>[] };
    expect(g['@graph']).toHaveLength(1);
    expect(g['@graph'][0]['@type']).toBe('WebPage');
  });

  it('news author hub CollectionPage references ProfilePage Person @id', () => {
    const g = buildNewsAuthorHubGraphJsonLd({
      origin: 'https://x.com',
      locale: 'en-us',
      authorSlug: 'jane-doe',
      articles: [{ slug: 'a-story', title: 'A Story' }],
      pageTitle: 'Jane — News',
      pageDescription: 'Desc.',
    }) as { '@graph': Record<string, unknown>[] };
    const page = g['@graph'][0] as { author: { '@id': string }; url: string };
    expect(page.url).toBe('https://x.com/us/news/author/jane-doe/');
    expect(page.author).toEqual({ '@id': 'https://x.com/us/people/jane-doe/#person' });
  });

  it('news author hub for firm byline references Organization @id', () => {
    const g = buildNewsAuthorHubGraphJsonLd({
      origin: 'https://x.com',
      locale: 'en-gb',
      authorSlug: 'schillings',
      articles: [{ slug: 'a-story', title: 'A Story' }],
      pageTitle: 'Schillings — News',
      pageDescription: 'Desc.',
    }) as { '@graph': Record<string, unknown>[] };
    const page = g['@graph'][0] as { author: { '@id': string }; url: string };
    expect(page.url).toBe('https://x.com/news/author/schillings/');
    expect(page.author).toEqual({ '@id': 'https://x.com/#organization' });
  });
});
