import { describe, expect, it } from 'vitest';
import { aboutUsOfficeSlug, getAboutUsRegionModel } from './about-us-region';

describe('aboutUsOfficeSlug', () => {
  it('maps locale clusters to primary office narratives', () => {
    expect(aboutUsOfficeSlug('en-gb')).toBe('london');
    expect(aboutUsOfficeSlug('en-us')).toBe('miami');
    expect(aboutUsOfficeSlug('en-ie')).toBe('dublin');
  });
});

describe('getAboutUsRegionModel', () => {
  it('produces distinct titles per locale', () => {
    const gb = getAboutUsRegionModel('en-gb').metaTitle;
    const us = getAboutUsRegionModel('en-us').metaTitle;
    const ie = getAboutUsRegionModel('en-ie').metaTitle;
    expect(gb).not.toBe(us);
    expect(ie).toContain('Ireland');
  });
});
