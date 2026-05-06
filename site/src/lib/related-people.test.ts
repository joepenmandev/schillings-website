import { describe, it, expect } from 'vitest';
import { getColleaguesForPersonProfile, getRelatedPeople } from './related-people';
import type { PersonProfile } from '../data/people';

const base = (over: Partial<PersonProfile> & Pick<PersonProfile, 'slug' | 'name'>): PersonProfile => ({
  slug: over.slug,
  name: over.name,
  role: over.role ?? 'Partner',
  office: over.office ?? 'London',
  officeId: over.officeId ?? 'london',
  seniority: over.seniority ?? 'partner',
  practiceGroup: over.practiceGroup,
  expertise: over.expertise ?? [],
  paragraphs: over.paragraphs ?? ['Bio.'],
  draft: false,
});

describe('getRelatedPeople', () => {
  it('prioritises shared expertise then office', () => {
    const current = base({
      slug: 'a',
      name: 'Alpha',
      officeId: 'london',
      expertise: ['reputation_privacy', 'litigation_disputes'],
    });
    const all: PersonProfile[] = [
      current,
      base({ slug: 'b', name: 'Beta', officeId: 'london', expertise: ['reputation_privacy'] }),
      base({ slug: 'c', name: 'Gamma', officeId: 'dublin', expertise: ['reputation_privacy', 'litigation_disputes'] }),
      base({ slug: 'd', name: 'Delta', officeId: 'miami', expertise: ['regulatory'] }),
    ];
    const related = getRelatedPeople(all, current, 4);
    expect(related.map((p) => p.slug)).toContain('c');
    expect(related.map((p) => p.slug)).toContain('b');
    expect(related[0]?.slug).toBe('c');
  });
});

describe('getColleaguesForPersonProfile', () => {
  it('lists same practice group by seniority (most senior first)', () => {
    const current = base({
      slug: 'me',
      name: 'Me',
      practiceGroup: 'legal',
      seniority: 'partner',
      role: 'Partner',
      paragraphs: ['Qualified solicitor practising in London.'],
    });
    const all: PersonProfile[] = [
      current,
      base({
        slug: 'junior',
        name: 'Junior',
        practiceGroup: 'legal',
        seniority: 'associate',
        role: 'Associate',
        paragraphs: ['Qualified solicitor.'],
      }),
      base({
        slug: 'senior',
        name: 'Senior',
        practiceGroup: 'legal',
        seniority: 'senior_associate',
        role: 'Senior Associate',
        paragraphs: ['Qualified solicitor.'],
      }),
      base({
        slug: 'other-dept',
        name: 'Other',
        practiceGroup: 'isd',
        seniority: 'partner',
        role: 'Partner',
        paragraphs: ['Intelligence.'],
      }),
    ];
    const { isDepartmentScoped, primary, overflow } = getColleaguesForPersonProfile(all, current, 2);
    expect(isDepartmentScoped).toBe(true);
    expect(primary.map((p) => p.slug)).toEqual(['senior', 'junior']);
    expect(overflow.map((p) => p.slug)).toEqual([]);
  });
});
