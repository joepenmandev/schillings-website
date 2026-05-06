/**
 * Schillings office locations — contact pages, international hub, form defaults.
 * Update emails here if they differ per office.
 */
import type { Locale } from '../i18n/config';
export const officeSlugs = ['london', 'miami', 'dublin'] as const;
export type OfficeSlug = (typeof officeSlugs)[number];

/** Qualifying form `region` radio values */
export type OfficeFormRegion = 'uk' | 'us' | 'ie';

export type Office = {
  slug: OfficeSlug;
  /** Page H1 */
  name: string;
  /** Short label for cards */
  cityLabel: string;
  addressLines: readonly string[];
  phoneDisplay: string;
  phoneHref: string;
  /** ITU-style for JSON-LD `ContactPoint.telephone` — keep aligned with `phoneHref`. */
  schemaTelephone: string;
  email: string;
  formRegion: OfficeFormRegion;
  /** Map centre (OpenStreetMap tiles + custom marker on the client) */
  mapLat: number;
  mapLng: number;
  mapZoom: number;
  mapIframeTitle: string;
};

export const OFFICES: Record<OfficeSlug, Office> = {
  london: {
    slug: 'london',
    name: 'London',
    cityLabel: 'London',
    addressLines: ['12 Arthur St', 'London, EC4R 9AB', 'UK'],
    phoneDisplay: '+44 (0)20 7034 9000',
    phoneHref: 'tel:+442070349000',
    schemaTelephone: '+44-20-7034-9000',
    email: 'enquiries@schillingspartners.com',
    formRegion: 'uk',
    mapIframeTitle: 'Map — Schillings London office',
    mapLat: 51.51125,
    mapLng: -0.089,
    mapZoom: 17,
  },
  miami: {
    slug: 'miami',
    name: 'Miami',
    cityLabel: 'Miami',
    addressLines: ['1101 Brickell Avenue', 'South Tower, 8th Floor', 'Miami, FL 33131', 'USA'],
    phoneDisplay: '+1 (305) 728 8832',
    phoneHref: 'tel:+13057288832',
    schemaTelephone: '+1-305-728-8832',
    email: 'enquiries@schillingspartners.com',
    formRegion: 'us',
    mapIframeTitle: 'Map — Schillings Miami office',
    mapLat: 25.7618,
    mapLng: -80.1915,
    mapZoom: 17,
  },
  dublin: {
    slug: 'dublin',
    name: 'Dublin',
    cityLabel: 'Dublin',
    addressLines: ['9 Pembroke Street Upper', 'Dublin 2, D02 KR83', 'Ireland'],
    phoneDisplay: '+353 1 270 9390',
    phoneHref: 'tel:+35312709390',
    schemaTelephone: '+353-1-270-9390',
    email: 'enquiries@schillingspartners.com',
    formRegion: 'ie',
    mapIframeTitle: 'Map — Schillings Dublin office',
    mapLat: 53.3349,
    mapLng: -6.2525,
    mapZoom: 17,
  },
};

export function isOfficeSlug(value: string): value is OfficeSlug {
  return (officeSlugs as readonly string[]).includes(value);
}

export function getOffice(slug: string): Office | undefined {
  return isOfficeSlug(slug) ? OFFICES[slug] : undefined;
}

/** HTML sitemap label */
export function officeSitemapLabel(slug: OfficeSlug): string {
  return `${OFFICES[slug].cityLabel} office`;
}

export function allOffices(): Office[] {
  return officeSlugs.map((s) => OFFICES[s]);
}

/** ISO 3166-1 alpha-2 for JSON-LD */
export function officeAddressCountry(slug: OfficeSlug): string {
  if (slug === 'london') return 'GB';
  if (slug === 'miami') return 'US';
  return 'IE';
}

const IMMEDIATE_RESPONSE_OFFICE_BY_LOCALE: Record<Locale, OfficeSlug> = {
  'en-gb': 'london',
  'en-us': 'miami',
  'en-ie': 'dublin',
};

/** Urgent-line display + `tel:` href for `/24-7-immediate-response/` — matches regional site, not UK-only. */
export function immediateResponsePhoneForLocale(locale: Locale): Pick<Office, 'phoneDisplay' | 'phoneHref'> {
  const slug = IMMEDIATE_RESPONSE_OFFICE_BY_LOCALE[locale];
  const o = OFFICES[slug];
  return { phoneDisplay: o.phoneDisplay, phoneHref: o.phoneHref };
}

/** Region step + routing office for main `/contact/` pages (matches locale cluster). */
export function contactQualifyingDefaults(locale: Locale): {
  defaultRegion: OfficeFormRegion;
  preferredOffice: OfficeSlug;
} {
  const slug = IMMEDIATE_RESPONSE_OFFICE_BY_LOCALE[locale];
  const o = OFFICES[slug];
  return { defaultRegion: o.formRegion, preferredOffice: slug };
}
