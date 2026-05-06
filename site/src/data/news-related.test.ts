import { describe, expect, it } from 'vitest';
import { getNewsBySlug } from './news';
import { authorSlugsForRelatedPosts, getRelatedNewsByArticleAuthors } from './news';

describe('getRelatedNewsByArticleAuthors', () => {
  it('returns other articles sharing a credited author', () => {
    const a = getNewsBySlug('10-things-lawyers-should-consider-when-instructing-investigators');
    expect(a).toBeTruthy();
    expect(authorSlugsForRelatedPosts(a!).length).toBeGreaterThan(0);
    const related = getRelatedNewsByArticleAuthors(a!, 80);
    expect(related.every((x) => x.slug !== a!.slug)).toBe(true);
    expect(related.length).toBeGreaterThan(0);
  });
});
