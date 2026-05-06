import { describe, expect, it } from 'vitest';
import { buildStrategicCrawlPathnames, isStrategicInternalPathname } from './strategic-crawl-lib';
import { getAllSituationPathSlugs, getAllWhatWeProtectPathSlugs } from '../src/data/strategic-rebuild-content';
import { getAllExpertisePathSlugs } from '../src/lib/expertise-paths';
import { locales } from '../src/i18n/config';

describe('strategic-crawl-lib', () => {
  it('builds expected number of paths per locale from strategic-rebuild-content slugs', () => {
    const rows = buildStrategicCrawlPathnames();
    const perLocale = locales.length;
    const situations = getAllSituationPathSlugs().length;
    const wwp = getAllWhatWeProtectPathSlugs().length;
    const expectedPerLocale = 1 + 1 + situations + 1 + wwp + 1 + 1 + getAllExpertisePathSlugs().length + 1 + 1;
    expect(rows).toHaveLength(perLocale * expectedPerLocale);
  });

  it('detects strategic pathnames for UK and prefixed locales', () => {
    expect(isStrategicInternalPathname('/situations/')).toBe(true);
    expect(isStrategicInternalPathname('/situations/media-exposure-scrutiny/')).toBe(true);
    expect(isStrategicInternalPathname('/us/news/')).toBe(true);
    expect(isStrategicInternalPathname('/ie/what-we-protect/reputation/')).toBe(true);
    expect(isStrategicInternalPathname('/contact/')).toBe(false);
    expect(isStrategicInternalPathname('/expertise/reputation-privacy/')).toBe(true);
  });
});
