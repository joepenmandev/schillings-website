import { describe, expect, it } from 'vitest';
import { localeHrefResponseSystemPillar } from './site-nav';

describe('localeHrefResponseSystemPillar', () => {
  it('appends stable pillar fragment per locale', () => {
    expect(localeHrefResponseSystemPillar('en-gb', 'legal')).toBe('/response-system/#legal');
    expect(localeHrefResponseSystemPillar('en-us', 'intelligence')).toBe('/us/response-system/#intelligence');
    expect(localeHrefResponseSystemPillar('en-ie', 'security')).toBe('/ie/response-system/#security');
    expect(localeHrefResponseSystemPillar('en-gb', 'communications')).toBe('/response-system/#communications');
  });
});
