import { describe, expect, it } from 'vitest';
import type { PersonRecognition } from '@/data/people';
import { buildPersonMetaDescription, buildPersonPageTitle, buildPersonProfilePageJsonLd } from './person-jsonld';

describe('buildPersonPageTitle', () => {
  it('omits directory suffix when there are no recognitions', () => {
    expect(buildPersonPageTitle('Jane Doe', 'Partner, Legal')).toBe('Jane Doe — Partner, Legal | Schillings');
  });

  it('appends stable directory abbreviations when recognitions list publishers', () => {
    const r: PersonRecognition[] = [
      { provider: 'spears', title: 'Listed', year: '2026', scope: 'person', href: 'https://example.com/a' },
      { provider: 'chambers', title: 'Band 1', year: '2026', scope: 'person', href: 'https://example.com/b' },
      { provider: 'legal500', title: 'Listed', year: '2026', scope: 'person', href: 'https://example.com/c' },
    ];
    expect(buildPersonPageTitle('Jane Doe', 'Partner, Legal', 62, r)).toBe(
      'Jane Doe — Partner, Legal · CP, L500, SP | Schillings',
    );
  });

  it('truncates role to keep title within max length when suffix is present', () => {
    const r: PersonRecognition[] = [{ provider: 'legal500', title: 'Listed', year: '2026', scope: 'person' }];
    const longRole = 'Very Long Role Name That Would Overflow The Title Budget';
    const title = buildPersonPageTitle('Jane Doe', longRole, 62, r);
    expect(title.endsWith(' · L500 | Schillings')).toBe(true);
    expect(title.length).toBeLessThanOrEqual(62);
  });
});

describe('buildPersonMetaDescription', () => {
  it('includes directory hint when recognitions are set', () => {
    const r: PersonRecognition[] = [
      { provider: 'chambers', title: 'Band 1', year: '2026', scope: 'person' },
      { provider: 'legal500', title: 'Listed', year: '2026', scope: 'person' },
    ];
    const d = buildPersonMetaDescription('Partner', 'London', [], 'Bio text here.', 158, r);
    expect(d).toContain('Recognised in Chambers and Partners, The Legal 500.');
  });
});

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
