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

/* --- Intelligence (editorial) — copied from `NewsArchiveIndexHero` / `NewsHubIndexHero` / post & featured heroes. --- */

/**
 * Intelligence archive & topic/author hub `<h1>` typography (margin is contextual — e.g. hub adds `mt-2`).
 * Not {@link STRATEGIC_PAGE_H1_CLASS}.
 */
export const NEWS_HUB_H1_CLASS =
  'font-serif text-[1.75rem] font-extralight leading-[1.12] tracking-tight text-secondary-4 sm:text-[2.1rem] md:text-[2.45rem]';

/**
 * Article and featured-story headline typography (`NewsArticlePostHero` adds `post-full-heading` separately).
 */
export const NEWS_EDITORIAL_HEADLINE_CLASS =
  'font-serif text-[1.65rem] font-normal leading-[1.15] tracking-tight text-[#3c3b39] sm:text-[2rem] lg:text-[2.2rem]';

/** Topic/author filter labels, hub eyebrow scale, “Related capabilities” strip label (`NewsArchiveFilters`, `NewsTopicStrip`, `NewsHubIndexHero`). */
export const NEWS_MICRO_LABEL_CLASS =
  'text-[0.65rem] font-medium uppercase tracking-[0.18em] text-secondary-2';

/** Inner width shell under Intelligence sage mastheads (`NewsArchiveIndexHero`, `NewsHubIndexHero`). */
export const NEWS_MASTHEAD_INNER_CLASS =
  'mx-auto max-w-[min(88rem,calc(100%-1.5rem))] pb-6 md:pb-7';

/** Primary in-body editorial text link (archive meta link, author foot profile/archive links). */
export const NEWS_TEXT_LINK_CLASS =
  'font-medium text-secondary-4 underline decoration-secondary-2/40 underline-offset-2 hover:text-secondary-3';
