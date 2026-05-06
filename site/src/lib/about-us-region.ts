import type { Locale } from '../i18n/config';
import type { OfficeSlug } from './offices';

/**
 * Regional focus for each locale cluster’s `/about-us/` page (office hub + narrative).
 * Firm history: widely reported founding story (London, 1984). Dublin expansion from Schillings newsroom article in repo.
 */
export function aboutUsOfficeSlug(locale: Locale): OfficeSlug {
  if (locale === 'en-us') return 'miami';
  if (locale === 'en-ie') return 'dublin';
  return 'london';
}

export type AboutUsRegionModel = {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroLead: string;
  storyEyebrow: string;
  storyTitle: string;
  storyParagraphs: string[];
  officeEyebrow: string;
  officeTitle: string;
  officeParagraphs: string[];
  leadershipTitle: string;
  leadershipIntro: string;
  teamCtaLabel: string;
  /** `people/?office=` filter — aligns with directory */
  teamOfficeParam: OfficeSlug;
  missionEyebrow: string;
  missionTitle: string;
  missionParagraphs: string[];
  globalEyebrow: string;
  globalTitle: string;
  globalParagraphs: string[];
  /** Optional link to firm news article (slug only) */
  relatedNewsSlug?: string;
};

export function getAboutUsRegionModel(locale: Locale): AboutUsRegionModel {
  if (locale === 'en-us') {
    return {
      metaTitle: 'About Schillings — United States | Schillings',
      metaDescription:
        'Schillings in the United States — Miami Brickell office, US leadership, and how our Americas hub works with London and Dublin on reputation, privacy, and security.',
      heroTitle: 'About Schillings in the United States',
      heroLead:
        'Schillings deploys integrated legal, intelligence, communications, and security expertise for high-stakes situations. Our Miami office at Brickell anchors client work across the United States and Latin America, coordinated with our global offices.',
      storyEyebrow: 'Our origins',
      storyTitle: 'From London to an Americas hub',
      storyParagraphs: [
        'Schillings began in London in 1984 when Keith Schilling and Nicholas Lom founded Schilling & Lom as a media-law boutique focused on defamation, privacy, and reputation.',
        'Today Schillings International (USA) LLP serves clients from Brickell, Miami—alongside Schillings offices in London and Dublin and alliances with specialist firms in other jurisdictions.',
      ],
      officeEyebrow: 'Miami office',
      officeTitle: 'Brickell — United States hub',
      officeParagraphs: [
        'Partner Allan Dunlavy leads Schillings’ Miami office, supporting mandates across the US and Latin America with regional insight—alongside colleagues in London and Dublin.',
        'Visit our Miami office page for address, map, phone, and how to reach the team.',
      ],
      leadershipTitle: 'US leadership & profiles',
      leadershipIntro: 'Explore profiles for Miami leadership and the wider Schillings partnership.',
      teamCtaLabel: 'Meet US-connected colleagues',
      teamOfficeParam: 'miami',
      missionEyebrow: 'Mission',
      missionTitle: 'Why clients rely on us',
      missionParagraphs: [
        'We are often the first port of call in a crisis—defending clients when reputations, privacy, or security are under threat.',
        'We also help unlock opportunities: building reputations, safeguarding privacy, and strengthening resilience when stakes are high.',
      ],
      globalEyebrow: 'Globally connected',
      globalTitle: 'London, Dublin, alliances',
      globalParagraphs: [
        'Schillings is headquartered in the City of London and maintains offices in Miami and Dublin, with strategic alliances including Clare Locke (US) and Giles George (Australia).',
      ],
    };
  }

  if (locale === 'en-ie') {
    return {
      metaTitle: 'About Schillings — Ireland | Schillings',
      metaDescription:
        'Schillings Ireland — Dublin EU hub at Pembroke Street, leadership, and Schillings Ireland LLP’s role alongside London and Miami for reputation, privacy, and security.',
      heroTitle: 'About Schillings in Ireland',
      heroLead:
        'Schillings Ireland LLP supports clients from Dublin as part of an integrated international firm—linking EU mandates with Schillings’ London headquarters and Miami Americas hub.',
      storyEyebrow: 'Our origins & Dublin',
      storyTitle: 'A London-founded firm with an EU base',
      storyParagraphs: [
        'Schillings was founded in London in 1984 by Keith Schilling and Nicholas Lom (originally Schilling & Lom), focused on media law, privacy, and reputation.',
        'In 2024 Schillings launched its first EU office in Dublin—9 Pembroke Street Upper—to broaden EU and cross-border support for clients in technology, commerce, and other sectors. At launch, Legal Director John Curtin relocated to Dublin; Partners Ben Hobbs and Phil Hartley divided time between London and Dublin; Consultant Partner Viv O’Connor-Jemmett was also based in Dublin for digital resilience and strategic communications (as announced at opening).',
      ],
      officeEyebrow: 'Dublin office',
      officeTitle: 'Pembroke Street — Ireland & EU gateway',
      officeParagraphs: [
        'Our Dublin office connects Irish and EU-facing matters with Schillings’ multidisciplinary teams in London and Miami.',
        'See address, map, and contact options on our Dublin office page.',
      ],
      leadershipTitle: 'Dublin leadership — profiles',
      leadershipIntro: 'Read profiles for colleagues linked to our Dublin office.',
      teamCtaLabel: 'Browse people in Dublin',
      teamOfficeParam: 'dublin',
      missionEyebrow: 'Mission',
      missionTitle: 'Why clients rely on us',
      missionParagraphs: [
        'We respond when reputations, privacy, or security are under threat—and help clients prepare before crises crystallise.',
        'Schillings combines legal excellence with intelligence, communications, security, and diplomacy for outcomes in court and in public narrative.',
      ],
      globalEyebrow: 'Globally connected',
      globalTitle: 'London, Miami, alliances',
      globalParagraphs: [
        'Alongside Dublin, Schillings operates from London (headquarters) and Miami, with alliances including Clare Locke and Giles George where regional counsel adds strength.',
      ],
      relatedNewsSlug: 'schillings-launches-dublin-office-expanding-global-reach',
    };
  }

  return {
    metaTitle: 'About Schillings — London & headquarters | Schillings',
    metaDescription:
      'Schillings — founded in London in 1984; today a multidisciplinary firm for reputation, privacy, intelligence, communications, and security. Headquarters in the City of London.',
    heroTitle: 'About Schillings',
    heroLead:
      'Schillings helps successful individuals and global organisations navigate high-stakes threats and opportunities—from London, our headquarters in the City, working with colleagues in Miami, Dublin, and allied firms worldwide.',
    storyEyebrow: 'Our history',
    storyTitle: 'Founded in London, 1984',
    storyParagraphs: [
      'Schillings was founded in 1984 by Keith Schilling and Nicholas Lom as Schilling & Lom—a media-law firm specialising in defamation and privacy at a time when protecting reputation in print and broadcast demanded relentless judgment.',
      'Over four decades the firm has evolved into a multidisciplinary consultancy: legal, intelligence, strategic communications, security, and diplomacy—still anchored by what began as London media-law excellence.',
    ],
    officeEyebrow: 'Headquarters',
    officeTitle: 'City of London — Arthur Street',
    officeParagraphs: [
      'Our headquarters at 12 Arthur Street, EC4R 9AB, houses senior leadership and core teams across practices.',
      'Visit our London office page for address, map, phone, and enquiry routes.',
    ],
    leadershipTitle: 'Leadership & profiles',
    leadershipIntro:
      'Keith Schilling founded the firm; Rod Christie Miller is Chairman; David Imison is CEO. Explore profiles and the wider partnership below.',
    teamCtaLabel: 'Meet our London team',
    teamOfficeParam: 'london',
    missionEyebrow: 'Mission',
    missionTitle: 'Our mission',
    missionParagraphs: [
      'We are often the first port of call in a crisis—defending clients from attacks on reputation, privacy, and security.',
      'We also help create and unlock high-stakes opportunities: building reputation, safeguarding privacy, and improving resilience.',
      'From litigation and regulatory pressure to communications and operational security, Schillings is relied upon worldwide.',
    ],
    globalEyebrow: 'International',
    globalTitle: 'Miami, Dublin & alliances',
    globalParagraphs: [
      'Beyond London we operate offices in Miami and Dublin, and maintain strategic alliances—including Clare Locke in the United States and Giles George in Australia—to support cross-border mandates.',
    ],
  };
}
