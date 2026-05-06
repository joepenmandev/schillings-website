import { describe, expect, it } from 'vitest';
import { isThinPersonProfile, THIN_PERSON_BIO_MAX_CHARS } from './person-profile-quality';

describe('person-profile-quality', () => {
  it('treats very short bios as thin', () => {
    expect(isThinPersonProfile({ paragraphs: ['x'.repeat(THIN_PERSON_BIO_MAX_CHARS - 1)] })).toBe(true);
    expect(isThinPersonProfile({ paragraphs: ['x'.repeat(THIN_PERSON_BIO_MAX_CHARS)] })).toBe(false);
  });

  it('joins paragraphs for length', () => {
    expect(
      isThinPersonProfile({
        paragraphs: [`${'a'.repeat(100)}`, `${'b'.repeat(100)}`],
      }),
    ).toBe(true);
    expect(
      isThinPersonProfile({
        paragraphs: [`${'a'.repeat(200)}`, `${'b'.repeat(200)}`],
      }),
    ).toBe(false);
  });
});
