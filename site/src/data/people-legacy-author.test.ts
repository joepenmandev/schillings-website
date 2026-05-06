import { describe, expect, it } from 'vitest';
import { publicContactEmailForPersonSlug, resolvePublishedPersonSlugFromLegacyCredit } from './people';

describe('resolvePublishedPersonSlugFromLegacyCredit', () => {
  it('matches exact published name', () => {
    expect(resolvePublishedPersonSlugFromLegacyCredit('Juliet Young')).toBe('juliet-young');
    expect(resolvePublishedPersonSlugFromLegacyCredit('Tim Robinson CBE')).toBe('tim-robinson');
  });

  it('returns null for multi-author style credits', () => {
    expect(resolvePublishedPersonSlugFromLegacyCredit('Jane Doe and John Smith')).toBeNull();
    expect(resolvePublishedPersonSlugFromLegacyCredit('A, B')).toBeNull();
  });

  it('returns null for unknown names', () => {
    expect(resolvePublishedPersonSlugFromLegacyCredit('Totally Fictional Name')).toBeNull();
  });
});

describe('publicContactEmailForPersonSlug', () => {
  it('derives schillings email from multi-part slug', () => {
    expect(publicContactEmailForPersonSlug('chris-bell-watson')).toBe('chris.bellwatson@schillingspartners.com');
  });

  it('returns null for single-segment slug', () => {
    expect(publicContactEmailForPersonSlug('mononym')).toBeNull();
  });
});

