import { describe, expect, it } from 'vitest';
import {
  expertiseHubAbsoluteUrls,
  indexableNewsAndPeopleAbsoluteUrls,
  isExcludedPeopleProfileFromSitemap,
  isThinMigrationNewsPath,
} from './sitemap-news-people';
import { EXPERTISE_IDS } from '../data/people-taxonomy';
import { getNewsBySlug } from '../data/news';
import { publishedPeople } from '../data/people';
import { publicPathname } from '../lib/public-url';
import { isThinPersonProfile } from '../lib/person-profile-quality';
import { locales } from '../i18n/config';

describe('sitemap-news-people', () => {
  it('includes UK / US / IE news URLs for a published slug', () => {
    const slug = 'privacy-reputation-safety-one-fight';
    expect(getNewsBySlug(slug)).toBeTruthy();
    const urls = indexableNewsAndPeopleAbsoluteUrls('https://example.com');
    for (const locale of locales) {
      expect(urls).toContain('https://example.com' + publicPathname(locale, `news/${slug}`));
    }
  });

  it('includes UK / US / IE people URLs for a published non-thin profile', () => {
    const person = publishedPeople().find((p) => !isThinPersonProfile(p));
    expect(person).toBeTruthy();
    const urls = indexableNewsAndPeopleAbsoluteUrls('https://example.com');
    for (const locale of locales) {
      expect(urls).toContain('https://example.com' + publicPathname(locale, `people/${person!.slug}`));
    }
  });

  it('omits thin bios from indexable people URLs', () => {
    const thin = publishedPeople().find((p) => isThinPersonProfile(p));
    if (!thin) return;
    const urls = indexableNewsAndPeopleAbsoluteUrls('https://example.com');
    for (const locale of locales) {
      expect(urls).not.toContain('https://example.com' + publicPathname(locale, `people/${thin.slug}`));
    }
    expect(isExcludedPeopleProfileFromSitemap(`https://example.com${publicPathname('en-gb', `people/${thin.slug}`)}`)).toBe(
      true,
    );
  });

  it('does not treat rss.xml as thin migration', () => {
    expect(isThinMigrationNewsPath('/news/rss.xml')).toBe(false);
  });

  it('includes UK / US / IE expertise hub URLs for every EXPERTISE_IDS slug', () => {
    const urls = expertiseHubAbsoluteUrls('https://example.com');
    expect(urls.length).toBe(EXPERTISE_IDS.length * locales.length);
    for (const id of EXPERTISE_IDS) {
      for (const locale of locales) {
        expect(urls).toContain('https://example.com' + publicPathname(locale, `expertise/${id}`));
      }
    }
  });
});
