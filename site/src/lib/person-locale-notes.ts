import type { Locale } from '../i18n/config';

/** Short site-region note on people bios (null = omit). */
export function personBioLocaleNote(locale: Locale): string | null {
  switch (locale) {
    case 'en-us':
      return 'You are on the United States site. Engagements are subject to US entity terms and conflicts checks.';
    case 'en-ie':
      return 'You are on the Ireland & EU gateway site. Some matters may involve Schillings Ireland LLP; engagements are subject to Irish regulation where applicable.';
    default:
      return null;
  }
}
