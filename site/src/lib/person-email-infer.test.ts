import { describe, expect, it } from 'vitest';
import { inferSchillingsEmailFromSlug } from './person-email-infer';

describe('inferSchillingsEmailFromSlug', () => {
  it('maps hyphenated slug to first.last@domain', () => {
    expect(inferSchillingsEmailFromSlug('adam-wilkinson')).toBe('adam.wilkinson@schillingspartners.com');
  });

  it('joins multi-part surnames with dots', () => {
    expect(inferSchillingsEmailFromSlug('mary-jane-watson-smith')).toBe('mary.jane.watson.smith@schillingspartners.com');
  });

  it('returns null for single-token slug', () => {
    expect(inferSchillingsEmailFromSlug('mononym')).toBeNull();
  });
});
