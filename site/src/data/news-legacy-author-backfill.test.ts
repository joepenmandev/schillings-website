import { describe, expect, it } from 'vitest';
import { getNewsBySlug } from './news';

describe('news legacy author → authorSlugs backfill', () => {
  it('infers slug when import had legacy line only', () => {
    const a = getNewsBySlug('how-gcs-can-protect-companies-from-geopolitical-headwinds');
    expect(a).toBeTruthy();
    expect(a!.authorSlugs).toEqual(['juliet-young']);
  });

  it('does not override explicit authorSlugs', () => {
    const a = getNewsBySlug('twelve-schillings-partners-featured-in-spears-500-guide-to-top-hnw-advisors');
    expect(a?.authorSlugs).toEqual(['chris-bell-watson']);
  });
});
