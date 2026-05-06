import type { Locale } from '../i18n/config';
import { publicPathname } from './public-url';

/** Primary labels + path segments after `/{locale}/` — aligned with `LIVE-SITE-EXTRACT.md` (legacy public IA). */
export const primaryNav = [
  { label: 'People', segment: 'people' },
  { label: 'Services', segment: 'services' },
  { label: 'News & Insights', segment: 'news' },
  { label: 'International', segment: 'international' },
  { label: 'About', segment: 'about-us' },
] as const;

export const contactSegment = 'contact';

export const immediateResponseSegment = '24-7-immediate-response';

export const complianceNav = [
  { label: 'Privacy & Disclaimer', segment: 'compliance/privacy-disclaimer' },
  { label: 'Complaints Handling', segment: 'compliance/complaints-handling' },
  { label: 'Schillings: Regulated by SRA', segment: 'compliance/schillings-sra' },
  { label: 'Candidate privacy notice', segment: 'compliance/candidate-privacy-notice' },
  { label: 'Standard Terms of Business', segment: 'compliance/standard-terms-of-business' },
] as const;

/** Website legal stubs — `IA-URL-SPEC.md` §1; pair with compliance row in footer. */
export const legalFooterNav = [
  { label: 'Cookies', segment: 'legal/cookies' },
  { label: 'Terms', segment: 'legal/terms' },
  { label: 'Regulatory', segment: 'legal/regulatory' },
  { label: 'Privacy notice (dev)', segment: 'legal/privacy-notice' },
] as const;

/** IA §1 utility pages — footer; not in primary header nav unless you opt in later. */
export const utilityFooterNav = [
  { label: 'Sitemap', segment: 'sitemap' },
  { label: 'Accessibility', segment: 'accessibility' },
  { label: 'Careers', segment: 'careers' },
] as const;

export function localeHref(locale: Locale, segment: string) {
  const clean = segment.replace(/^\/+|\/+$/g, '');
  return publicPathname(locale, clean);
}
