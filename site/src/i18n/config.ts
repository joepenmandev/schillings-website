export const locales = ['en-gb', 'en-us', 'en-ie'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en-gb';

/** Public URL segment for prefixed locales (UK has no segment). Internal `Locale` keys stay `en-us` / `en-ie`. */
export const localePathPrefix: Record<Exclude<Locale, 'en-gb'>, string> = {
  'en-us': 'us',
  'en-ie': 'ie',
};

export const localeLabels: Record<Locale, string> = {
  'en-gb': 'United Kingdom',
  'en-us': 'United States',
  'en-ie': 'Ireland & EU gateway',
};

/** Short labels for footer region control (avoids wrapping). */
export const localeSwitcherLabels: Record<Locale, string> = {
  'en-gb': 'United Kingdom',
  'en-us': 'United States',
  'en-ie': 'Ireland',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** BCP 47 for `<html lang>` */
export const htmlLang: Record<Locale, string> = {
  'en-gb': 'en-GB',
  'en-us': 'en-US',
  'en-ie': 'en-IE',
};

/** Open Graph `og:locale` */
export const ogLocale: Record<Locale, string> = {
  'en-gb': 'en_GB',
  'en-us': 'en_US',
  'en-ie': 'en_IE',
};
