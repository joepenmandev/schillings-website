/**
 * Shared Tailwind class strings for marketing / strategic page chrome.
 * Source of truth for patterns copied from Situations, What we protect, and Expertise templates.
 * Consumers should import these in new primitives; existing pages keep inline classes until migrated.
 */

/** Section label — matches `sectionKicker` / `sectionTitle` on strategic hubs and details. */
export const SECTION_KICKER_CLASS =
  'text-xs font-medium uppercase tracking-[0.18em] text-secondary-2';

/**
 * Hub grid link card (Situations index, Expertise index).
 * Copied from `SituationsIndexPage.astro` / `ExpertiseIndexCards.astro` anchor shells.
 */
export const HUB_LINK_CARD_ANCHOR_CLASS =
  'group flex min-h-[8.5rem] flex-col rounded-sm border border-secondary-2/20 bg-utility-1/90 px-5 py-5 transition-colors hover:border-secondary-3/35 hover:bg-utility-2/50 md:min-h-0 md:px-6 md:py-6';

export const HUB_LINK_CARD_TITLE_CLASS =
  'font-serif text-lg font-extralight text-secondary-4 group-hover:text-secondary-3 md:text-xl';

export const HUB_LINK_CARD_DESCRIPTION_CLASS =
  'mt-2 line-clamp-4 flex-1 text-sm font-extralight leading-snug text-secondary-3 md:line-clamp-3 md:text-[0.9375rem] md:leading-relaxed';

/**
 * Confidential CTA strip inner box (no outer vertical margin).
 * Copied from `SituationDetailPage.astro`, `SituationsIndexPage.astro`, `ExpertiseHubDetail.astro`.
 */
export const CTA_CONFIDENTIAL_SECTION_BOX_CLASS =
  'rounded-sm border border-secondary-2/20 bg-utility-2/35 px-5 py-8 md:px-8 md:py-10';

export const CTA_CONFIDENTIAL_BODY_CLASS =
  'text-pretty text-base font-extralight leading-relaxed text-secondary-3 md:text-[1.05rem]';

export const CTA_CONFIDENTIAL_BUTTON_CLASS =
  'inline-flex min-h-[2.75rem] items-center justify-center rounded-sm bg-secondary-4 px-6 py-3 text-center text-sm font-normal tracking-wide text-brand-white outline-offset-4 transition-opacity hover:opacity-92 focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary-4';

/** Typical outer margin when this strip follows main sections (pages pass via `class` on the primitive). */
export const CTA_CONFIDENTIAL_SECTION_MARGIN_CLASS = 'mt-12 md:mt-14';

/** Strategic hub/detail breadcrumb link — matches `crumbClass` in Situations, WWP, Response, Expertise. */
export const STRATEGIC_CRUMB_LINK_CLASS =
  'text-secondary-2 underline decoration-secondary-2/40 underline-offset-[0.15em] transition-colors hover:text-secondary-3 hover:decoration-secondary-3';

/** Strategic marketing `<h1>` — Situations, WWP, Response, Expertise hubs and details. */
export const STRATEGIC_PAGE_H1_CLASS =
  'font-serif text-pretty text-3xl font-extralight leading-tight tracking-tight text-secondary-4 md:text-[3.125rem] md:leading-[1.1]';

/** People directory index `<h1>` — intentionally smaller than {@link STRATEGIC_PAGE_H1_CLASS}. */
export const PEOPLE_DIRECTORY_H1_CLASS =
  'font-serif text-3xl font-extralight leading-tight tracking-tight text-secondary-4 md:text-4xl md:leading-[1.08] lg:text-[2.875rem]';

/** Published colleague profile `<h1>` — intentionally smaller than {@link STRATEGIC_PAGE_H1_CLASS}. */
export const PEOPLE_PROFILE_H1_CLASS =
  'font-serif text-3xl font-extralight leading-tight tracking-tight text-secondary-4 md:text-4xl md:leading-[1.06] lg:text-[2.75rem]';
