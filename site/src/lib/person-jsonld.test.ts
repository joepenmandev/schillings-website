import { describe, expect, it } from 'vitest';
import { buildPersonProfilePageJsonLd } from './person-jsonld';

describe('buildPersonProfilePageJsonLd', () => {
  it('includes workLocation and subjectOf BlogPosting graph when articles provided', () => {
    const out = buildPersonProfilePageJsonLd({
      name: 'Jane Doe',
      jobTitle: 'Partner',
      pageUrl: 'https://x.com/people/jane-doe/',
      origin: 'https://x.com',
      locale: 'en-gb',
      description: 'Bio.',
      knowsAbout: ['Privacy'],
      sameAs: ['https://linkedin.com/in/jane'],
      office: 'London',
      authoredArticles: [{ slug: 'a-story', title: 'A Story', date: '2026-01-15', dateModified: '2026-01-16' }],
    }) as { '@graph': Record<string, unknown>[] };

    const person = out['@graph'].find((n) => n['@type'] === 'Person') as Record<string, unknown>;
    expect(person.workLocation).toEqual({ '@type': 'Place', name: 'London' });
    expect(person.subjectOf).toEqual([{ '@id': 'https://x.com/news/a-story/#article' }]);

    const posting = out['@graph'].find((n) => n['@type'] === 'BlogPosting') as Record<string, unknown>;
    expect(posting.headline).toBe('A Story');
    expect(posting.dateModified).toBe('2026-01-16T12:00:00.000Z');
    expect((posting.author as { '@id': string })['@id']).toBe('https://x.com/people/jane-doe/#person');
  });

  it('uses publishedAt on authored article stubs when set', () => {
    const out = buildPersonProfilePageJsonLd({
      name: 'Jane Doe',
      jobTitle: 'Partner',
      pageUrl: 'https://x.com/people/jane-doe/',
      origin: 'https://x.com',
      locale: 'en-gb',
      description: 'Bio.',
      knowsAbout: [],
      sameAs: [],
      authoredArticles: [
        {
          slug: 'a-story',
          title: 'A Story',
          date: '2026-01-15',
          publishedAt: '2026-01-15T10:00:00.000Z',
        },
      ],
    }) as { '@graph': Record<string, unknown>[] };
    const posting = out['@graph'].find((n) => n['@type'] === 'BlogPosting') as Record<string, unknown>;
    expect(posting.datePublished).toBe('2026-01-15T10:00:00.000Z');
  });

  it('omits subjectOf when no articles', () => {
    const out = buildPersonProfilePageJsonLd({
      name: 'A',
      jobTitle: 'Role',
      pageUrl: 'https://x.com/people/a/',
      origin: 'https://x.com',
      locale: 'en-gb',
      description: 'Bio.',
      knowsAbout: [],
      sameAs: [],
    }) as { '@graph': Record<string, unknown>[] };
    const person = out['@graph'].find((n) => n['@type'] === 'Person') as Record<string, unknown>;
    expect(person.subjectOf).toBeUndefined();
    expect(out['@graph'].filter((n) => n['@type'] === 'BlogPosting')).toHaveLength(0);
  });
});
