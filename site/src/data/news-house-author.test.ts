import { describe, expect, it } from 'vitest';
import { newsAuthorPublicPathAfterLocale, SCHILLINGS_NEWS_AUTHOR_SLUG } from './news-house-author';

describe('news-house-author', () => {
  it('routes house editorial slug to Intelligence author archive, not People', () => {
    expect(newsAuthorPublicPathAfterLocale(SCHILLINGS_NEWS_AUTHOR_SLUG)).toBe(`news/author/${SCHILLINGS_NEWS_AUTHOR_SLUG}`);
  });

  it('routes named authors to people profiles', () => {
    expect(newsAuthorPublicPathAfterLocale('chris-bell-watson')).toBe('people/chris-bell-watson');
  });
});
