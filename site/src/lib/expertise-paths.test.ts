import { describe, expect, it } from 'vitest';
import { EXPERTISE_IDS } from '../data/people-taxonomy';
import {
  expertiseIdFromPathSlug,
  expertisePathSlug,
  getAllExpertisePathSlugs,
  isExpertisePathSlug,
} from './expertise-paths';

describe('expertise-paths', () => {
  it('covers every ExpertiseId', () => {
    for (const id of EXPERTISE_IDS) {
      const slug = expertisePathSlug(id);
      expect(typeof slug).toBe('string');
      expect(slug.length).toBeGreaterThan(0);
    }
  });

  it('public slugs are unique', () => {
    const slugs = getAllExpertisePathSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).toHaveLength(EXPERTISE_IDS.length);
  });

  it('round-trips id -> slug -> id for all ExpertiseId values', () => {
    for (const id of EXPERTISE_IDS) {
      const slug = expertisePathSlug(id);
      expect(expertiseIdFromPathSlug(slug)).toBe(id);
    }
  });

  it('getAllExpertisePathSlugs matches EXPERTISE_IDS order', () => {
    const slugs = getAllExpertisePathSlugs();
    expect(slugs).toEqual(EXPERTISE_IDS.map((id) => expertisePathSlug(id)));
  });

  it('returns undefined for invalid slugs', () => {
    expect(expertiseIdFromPathSlug('')).toBeUndefined();
    expect(expertiseIdFromPathSlug('reputation_privacy')).toBeUndefined();
    expect(expertiseIdFromPathSlug('unknown-hub')).toBeUndefined();
    expect(expertiseIdFromPathSlug('reputation-privacy/extra')).toBeUndefined();
  });

  it('isExpertisePathSlug matches expertiseIdFromPathSlug', () => {
    for (const id of EXPERTISE_IDS) {
      const slug = expertisePathSlug(id);
      expect(isExpertisePathSlug(slug)).toBe(true);
    }
    expect(isExpertisePathSlug('')).toBe(false);
    expect(isExpertisePathSlug('reputation_privacy')).toBe(false);
    expect(isExpertisePathSlug('not-a-slug')).toBe(false);
  });

  it('maps intelligence_security to intelligence-investigations and communications to strategic-communications', () => {
    expect(expertisePathSlug('intelligence_security')).toBe('intelligence-investigations');
    expect(expertisePathSlug('communications')).toBe('strategic-communications');
    expect(expertiseIdFromPathSlug('intelligence-investigations')).toBe('intelligence_security');
    expect(expertiseIdFromPathSlug('strategic-communications')).toBe('communications');
  });

  it('acceptance: public paths used by /expertise/[slug]/ resolve', () => {
    expect(expertiseIdFromPathSlug('reputation-privacy')).toBe('reputation_privacy');
    expect(expertiseIdFromPathSlug('intelligence-investigations')).toBe('intelligence_security');
    expect(expertiseIdFromPathSlug('digital-resilience-security')).toBe('digital_resilience');
    expect(expertiseIdFromPathSlug('strategic-communications')).toBe('communications');
  });
});
