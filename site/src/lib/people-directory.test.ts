import { describe, it, expect } from 'vitest';
import { SENIORITY_FILTER_ORDER, SENIORITY_IDS } from '../data/people-taxonomy';
import {
  compareDirectoryPeopleBySeniorityThenName,
  peopleDirectoryCardByline,
  publishedPeopleForOffice,
} from './people-directory';

describe('SENIORITY_FILTER_ORDER', () => {
  it('lists every seniority id exactly once in grid rank order', () => {
    expect(SENIORITY_FILTER_ORDER).toHaveLength(SENIORITY_IDS.length);
    expect([...new Set(SENIORITY_FILTER_ORDER)].sort()).toEqual([...SENIORITY_IDS].sort());
    expect(SENIORITY_FILTER_ORDER[0]).toBe('founder');
    expect(SENIORITY_FILTER_ORDER[1]).toBe('ceo');
    expect(SENIORITY_FILTER_ORDER[2]).toBe('ciso');
    expect(SENIORITY_FILTER_ORDER[3]).toBe('advisory_board');
    expect(SENIORITY_FILTER_ORDER[4]).toBe('partner');
    const sa = SENIORITY_FILTER_ORDER.indexOf('senior_analyst');
    const as = SENIORITY_FILTER_ORDER.indexOf('associate');
    expect(sa).toBeGreaterThan(-1);
    expect(as).toBeLessThan(sa);
  });
});

describe('publishedPeopleForOffice', () => {
  it('returns only people for that office, sorted by seniority', () => {
    const london = publishedPeopleForOffice('london');
    expect(london.length).toBeGreaterThan(0);
    expect(london.every((p) => p.officeId === 'london')).toBe(true);
    for (let i = 1; i < london.length; i++) {
      expect(
        compareDirectoryPeopleBySeniorityThenName(
          { seniority: london[i - 1].seniority ?? 'other', name: london[i - 1].name },
          { seniority: london[i].seniority ?? 'other', name: london[i].name },
        ),
      ).toBeLessThanOrEqual(0);
    }
  });
});

describe('compareDirectoryPeopleBySeniorityThenName', () => {
  it('orders founder and ceo before partners', () => {
    expect(
      compareDirectoryPeopleBySeniorityThenName(
        { seniority: 'partner', name: 'Zoe Cousins' },
        { seniority: 'founder', name: 'Adam Founder' },
      ),
    ).toBeGreaterThan(0);
    expect(
      compareDirectoryPeopleBySeniorityThenName(
        { seniority: 'ceo', name: 'David Imison' },
        { seniority: 'partner', name: 'Zoe Cousins' },
      ),
    ).toBeLessThan(0);
  });

  it('orders associates before senior analysts', () => {
    expect(
      compareDirectoryPeopleBySeniorityThenName(
        { seniority: 'associate', name: 'A' },
        { seniority: 'senior_analyst', name: 'Z' },
      ),
    ).toBeLessThan(0);
    expect(
      compareDirectoryPeopleBySeniorityThenName(
        { seniority: 'senior_analyst', name: 'Z' },
        { seniority: 'associate', name: 'A' },
      ),
    ).toBeGreaterThan(0);
  });

  it('orders partners before associates regardless of first name', () => {
    expect(
      compareDirectoryPeopleBySeniorityThenName(
        { seniority: 'associate', name: 'Anna Bloch' },
        { seniority: 'partner', name: 'Zoe Cousins' },
      ),
    ).toBeGreaterThan(0);
    expect(
      compareDirectoryPeopleBySeniorityThenName(
        { seniority: 'partner', name: 'Adam Wilkinson' },
        { seniority: 'associate', name: 'Anna Bloch' },
      ),
    ).toBeLessThan(0);
  });

  it('ties seniority by name', () => {
    expect(
      compareDirectoryPeopleBySeniorityThenName(
        { seniority: 'partner', name: 'B Smith' },
        { seniority: 'partner', name: 'A Jones' },
      ),
    ).toBeGreaterThan(0);
  });
});

describe('peopleDirectoryCardByline', () => {
  it('formats seniority and department for directory cards', () => {
    expect(peopleDirectoryCardByline('director', 'scom')).toBe('Director, Strategic Communications');
    expect(peopleDirectoryCardByline('senior_associate', 'dr')).toBe('Senior Associate, Digital Resilience & Security');
    expect(peopleDirectoryCardByline('associate', 'legal')).toBe('Associate, Legal Protection & Disputes');
    expect(peopleDirectoryCardByline('advisory_board', 'legal')).toBe('Advisory Board');
    expect(peopleDirectoryCardByline('founder', 'legal')).toBe('Founder, Legal Protection & Disputes');
    expect(peopleDirectoryCardByline('ceo', 'legal')).toBe('CEO, Legal Protection & Disputes');
    expect(peopleDirectoryCardByline('ciso', 'isd')).toBe('CISO, Intelligence & Investigations');
  });
});
