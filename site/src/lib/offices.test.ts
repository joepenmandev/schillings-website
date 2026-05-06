import { describe, expect, it } from 'vitest';
import { contactQualifyingDefaults, immediateResponsePhoneForLocale } from './offices';

describe('immediateResponsePhoneForLocale', () => {
  it('uses the regional office switchboard per locale cluster', () => {
    expect(immediateResponsePhoneForLocale('en-gb').phoneHref).toBe('tel:+442070349000');
    expect(immediateResponsePhoneForLocale('en-us').phoneHref).toBe('tel:+13057288832');
    expect(immediateResponsePhoneForLocale('en-ie').phoneHref).toBe('tel:+35312709390');
  });
});

describe('contactQualifyingDefaults', () => {
  it('matches region and routing office to locale cluster', () => {
    expect(contactQualifyingDefaults('en-gb')).toEqual({ defaultRegion: 'uk', preferredOffice: 'london' });
    expect(contactQualifyingDefaults('en-us')).toEqual({ defaultRegion: 'us', preferredOffice: 'miami' });
    expect(contactQualifyingDefaults('en-ie')).toEqual({ defaultRegion: 'ie', preferredOffice: 'dublin' });
  });
});
