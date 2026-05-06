import type { Locale } from '../i18n/config';
import {
  primaryNavigation,
  type StrategicPrimaryNavId,
  type StrategicResponseSystemId,
} from '../data/strategic-rebuild-content';
import { publicPathname } from './public-url';

/** URL segment per strategic nav id — hyphens in paths; `intelligence` → `/news/` until IA rename. */
const STRATEGIC_PRIMARY_NAV_SEGMENT = {
  situations: 'situations',
  what_we_protect: 'what-we-protect',
  response_system: 'response-system',
  sectors: 'services',
  people: 'people',
  intelligence: 'news',
  about: 'about-us',
} as const satisfies Record<StrategicPrimaryNavId, string>;

export type PrimaryNavItem = {
  readonly label: string;
  readonly segment: string;
};

/** Primary header/footer nav — sourced from `strategic-rebuild-content` labels + IA segments above. */
export const primaryNav: readonly PrimaryNavItem[] = primaryNavigation.map((item) => ({
  label: item.label,
  segment: STRATEGIC_PRIMARY_NAV_SEGMENT[item.id],
}));

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

/** `/response-system/` plus stable pillar fragment (`#intelligence`, `#legal`, …). */
export function localeHrefResponseSystemPillar(locale: Locale, pillarId: StrategicResponseSystemId): string {
  return `${localeHref(locale, 'response-system')}#${pillarId}`;
}
