/**
 * Pure parsing for `import:people` — shared with Vitest so tag mapping, bio rules,
 * LinkedIn extraction, and headshot heuristics stay covered without network calls.
 */
import { parse, type HTMLElement } from 'node-html-parser';
import {
  EXPERTISE_IDS,
  OFFICE_LABELS,
  SENIORITY_IDS,
  type ExpertiseId,
  type OfficeId,
  type SeniorityId,
} from '../data/people-taxonomy';

/** Map live CMS tags → our ExpertiseId values (subset of people-taxonomy). */
export const TAG_TO_EXPERTISE: Record<string, ExpertiseId> = {
  'Crisis Management': 'intelligence_security',
  Geopolitics: 'international',
  'Reputation Management/Defence': 'reputation_privacy',
  Defamation: 'reputation_privacy',
  Libel: 'reputation_privacy',
  'Strategic Communications': 'communications',
  'Schillings Communications': 'communications',
  'Digital Communications': 'communications',
  'Digital Resilience': 'digital_resilience',
  'Corporate Communications': 'communications',
  Litigation: 'litigation_disputes',
  Investigations: 'intelligence_security',
  Privacy: 'reputation_privacy',
  Employment: 'litigation_disputes',
  'Financial Crime': 'regulatory',
  'Asset Tracing': 'corporate_transactions',
  'Media Law': 'reputation_privacy',
  'Stakeholder Engagement': 'communications',
  'Commercial Litigation': 'litigation_disputes',
  'Regulatory Investigations': 'regulatory',
  'Cyber Security': 'intelligence_security',
  Fraud: 'regulatory',
  'White Collar Crime': 'regulatory',
  'International Arbitration': 'international',
  'Public Affairs': 'communications',
  'Government Relations': 'communications',
  IP: 'reputation_privacy',
  'Intellectual Property': 'reputation_privacy',
  Trademark: 'reputation_privacy',
  'Family Law': 'litigation_disputes',
  'Due Diligence': 'corporate_transactions',
  'Risk Advisory': 'regulatory',
  'Corporate Intelligence': 'intelligence_security',
  'Business Intelligence': 'intelligence_security',
  'Data Protection': 'reputation_privacy',
  'Information Law': 'reputation_privacy',
  'Contentious Trusts': 'litigation_disputes',
  'Private Client': 'reputation_privacy',
  'Sports Law': 'litigation_disputes',
  'Art Law': 'litigation_disputes',
  Sanctions: 'international',
  Diplomacy: 'international',
  'Private Diplomacy': 'international',
  'Critical Risk': 'intelligence_security',
  'Cyber Security Advisory': 'intelligence_security',
  'Data Privacy': 'reputation_privacy',
  Extortion: 'intelligence_security',
  Intel: 'intelligence_security',
  'Media Attention': 'communications',
  'Physical Security': 'intelligence_security',
  'Privacy Threats': 'reputation_privacy',
  'strategic intelligence': 'intelligence_security',
};

/** Location-style CMS tags (not mapped to expertise). */
export const NON_EXPERTISE_TAG_LABELS = new Set([
  'London',
  'Dublin',
  'Miami',
  'Auckland',
  'UK',
  'USA',
  'Ireland',
]);

/**
 * When Webflow renders no tag pills (`w-dyn-empty`), approximate expertise from
 * public role + bio copy. Used only if CMS tags produced no mapped ids.
 */
const BIO_EXPERTISE_RULES: { re: RegExp; ids: ExpertiseId[] }[] = [
  { re: /\b(chief information security officer|\bciso\b)\b/i, ids: ['intelligence_security'] },
  { re: /\b(geopolitical|pre[-‑]war russia|central asia)\b/i, ids: ['international', 'intelligence_security'] },
  { re: /\b(middle east|north africa|\bmena\b)\b/i, ids: ['international'] },
  {
    re: /\b(senior intelligence analyst|intelligence analyst|open[- ]source|osint|corporate intelligence)\b/i,
    ids: ['intelligence_security'],
  },
  {
    re: /\b(maritime matters|shipping analyst|intelligence consultant\b.*\bmaritime\b|\bmaritime\b.*\binternational trade)\b/i,
    ids: ['international', 'intelligence_security'],
  },
  { re: /\b(privacy exposure|reputational due diligence)\b/i, ids: ['reputation_privacy', 'intelligence_security'] },
  {
    re: /\b(defamation|malicious falsehood|reputation and privacy lawyer|reputation lawyer|media lawyer|data protection law|breach of confidence|passing off)\b/i,
    ids: ['reputation_privacy'],
  },
  {
    re: /\b(commercial litigation|civil fraud|litigation strategy|cross[- ]jurisdictional litigation)\b/i,
    ids: ['litigation_disputes'],
  },
  { re: /\bregulatory proceedings\b|\bregulatory environments\b/i, ids: ['regulatory'] },
  {
    re: /\b(paid media|social media strategy|social media channels|influencer|communications agencies|integrated marketing campaigns)\b/i,
    ids: ['communications'],
  },
  { re: /\b(social intelligence|fast[-‑]moving news|online narratives)\b/i, ids: ['communications', 'intelligence_security'] },
  {
    re: /\b(smear campaigns|blackmail|cryptocurrency tracing|asset tracing|global investigations into)\b/i,
    ids: ['intelligence_security', 'regulatory', 'corporate_transactions'],
  },
  { re: /\b(ambassador to the united nations|national security adviser)\b/i, ids: ['international', 'intelligence_security'] },
  {
    re: /\b(group chief executive of bp|crossbench life peer|chairman of the board of directors at smiths|director of pepsico)\b/i,
    ids: ['international', 'corporate_transactions'],
  },
  { re: /\b(optimis(e|ing) their digital|right to privacy|profiles online)\b/i, ids: ['communications', 'reputation_privacy'] },
  {
    re: /\b(intrusive or inaccurate reporting|fast[-‑]moving crises|media organisations operate)\b/i,
    ids: ['reputation_privacy', 'communications'],
  },
  { re: /\b(privacy, ip and commercial|harmful content|data breach and leak)\b/i, ids: ['reputation_privacy', 'litigation_disputes'] },
  { re: /\b(data protection, reputation|data protection, reputation management)\b/i, ids: ['reputation_privacy', 'litigation_disputes'] },
];

export function sortExpertiseIds(ids: readonly string[]): ExpertiseId[] {
  const seen = new Set<ExpertiseId>();
  for (const id of ids) {
    if ((EXPERTISE_IDS as readonly string[]).includes(id)) seen.add(id as ExpertiseId);
  }
  return [...seen].sort((a, b) => EXPERTISE_IDS.indexOf(a) - EXPERTISE_IDS.indexOf(b));
}

export function inferExpertiseFromBio(role: string, paragraphs: string[]): ExpertiseId[] {
  const blob = `${role}\n${paragraphs.join('\n')}`.toLowerCase();
  const ids = new Set<ExpertiseId>();
  for (const { re, ids: add } of BIO_EXPERTISE_RULES) {
    if (re.test(blob)) for (const id of add) ids.add(id);
  }
  return [...ids];
}

export function dedupeRoleGlitch(text: string): string {
  if (!text) return '';
  let t = text.replace(/\s+/g, ' ').trim();
  t = t.replace(/([\w\s,&/-]{4,80}?)\1+/g, '$1');
  return t.replace(/\s*&\s*$/g, '').trim();
}

export function roleFromPage(title: string, name: string, roleDivText: string): string {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = title.match(new RegExp(`^${esc},\\s*(.+?)\\s*\\|\\s*Schillings\\s*$`, 'i'));
  const fromTitle = m ? m[1].trim() : '';
  if (fromTitle.length > 2) return fromTitle;
  return dedupeRoleGlitch(roleDivText);
}

export function inferOffice(role: string, bio: string, _name: string): OfficeId {
  const blob = `${role} ${bio}`.toLowerCase();
  if (/\bdublin\b|\bireland\b|\bd02\b|\blsra\b|\blaw society of ireland\b/.test(blob)) return 'dublin';
  if (/\bmiami\b|\bflorida\b|\bbrickell\b|\bdelaware\b|\busa\b|\bunited states\b/.test(blob)) return 'miami';
  if (/\bauckland\b|\bwellington\b|\bnew zealand\b|\bnzls\b|\bbarrister and solicitor in new zealand\b/.test(blob)) {
    return 'auckland';
  }
  if (/\blondon\b|\buk\b|\bec4r\b|\bengland\b|\bwales\b/.test(blob)) return 'london';
  return 'london';
}

export function inferSeniority(roleLower: string): SeniorityId {
  if (/\badvisory board\b/.test(roleLower)) return 'advisory_board';
  if (/\bchief executive officer\b/.test(roleLower)) return 'ceo';
  if (
    /\bchief information security officer\b/.test(roleLower) ||
    /\bchief information officer\b/.test(roleLower) ||
    /\bchief technology officer\b/.test(roleLower) ||
    /\bchief digital officer\b/.test(roleLower)
  ) {
    return 'ciso';
  }
  if (/\bfounded schillings\b/.test(roleLower)) return 'founder';
  if (/\bpartner\b|\bchair\b|\bchairman\b/.test(roleLower)) return 'partner';
  if (/\bsenior analyst\b|\blead analyst\b/.test(roleLower)) return 'senior_analyst';
  if (/\bjunior analyst\b|\banalyst\b/.test(roleLower)) return 'analyst';
  if (/\bsenior associate\b/.test(roleLower)) return 'senior_associate';
  if (/\bsenior legal (adviser|advisor)\b|\bof counsel\b|\bcounsel\b|\bconsultant\b/.test(roleLower)) return 'senior_associate';
  if (/\bdirector\b/.test(roleLower)) return 'director';
  if (/\bsenior solicitor\b/.test(roleLower)) return 'senior_associate';
  if (/\bsolicitor\b/.test(roleLower) && !/\bpartner\b/.test(roleLower)) return 'associate';
  if (/\bassociate\b|\bparalegal\b|\btrainee\b/.test(roleLower)) return 'associate';
  if (/\bhead of\b|\bmanager\b|\bofficer\b/.test(roleLower)) return 'business_services';
  return 'other';
}

/** Maps legacy import values and re-infers when the stored id is unknown. */
export function normalizeImportedSeniority(raw: string, role: string, bioHint = ''): SeniorityId {
  const r = role.toLowerCase();
  const bio = bioHint.toLowerCase().slice(0, 4000);
  const roleAndBio = `${r} ${bio}`.trim();
  const migrated = raw === 'counsel' ? 'senior_associate' : raw;
  let resolved: SeniorityId =
    (SENIORITY_IDS as readonly string[]).includes(migrated) ? (migrated as SeniorityId) : inferSeniority(roleAndBio);

  // Import JSON often used `other` as a placeholder; prefer role + opening bio when inference is specific.
  if (resolved === 'other') {
    const fromRole = inferSeniority(roleAndBio);
    if (fromRole !== 'other') resolved = fromRole;
  }

  if (resolved === 'associate') {
    if (/\bsenior associate\b/.test(r)) return 'senior_associate';
    if (/\bsenior analyst\b/.test(r)) return 'senior_analyst';
    if (/\b(junior analyst|\banalyst\b)\b/.test(r) && !/\b(senior legal|legal adviser|legal advisor|solicitor)\b/.test(r)) {
      return 'analyst';
    }
  }

  if (resolved === 'business_services' && /\bdirector\b/.test(r)) return 'director';

  if (/\bchief executive officer\b/.test(r)) return 'ceo';

  if (
    /\bchief information security officer\b/.test(r) ||
    /\bchief information officer\b/.test(r) ||
    /\bchief technology officer\b/.test(r) ||
    /\bchief digital officer\b/.test(r)
  ) {
    return 'ciso';
  }

  if (resolved === 'business_services' && /\bchief\b/.test(r) && /\bofficer\b/.test(r)) return 'ciso';

  if (/\bfounded schillings\b/i.test(bio)) return 'founder';

  return resolved;
}

export function tagsToExpertiseFromLabels(tagLabels: readonly string[]): {
  ids: ExpertiseId[];
  unknownLabels: string[];
} {
  const ids = new Set<ExpertiseId>();
  const unknownLabels: string[] = [];
  for (const raw of tagLabels) {
    const label = raw.trim();
    if (!label) continue;
    const id = TAG_TO_EXPERTISE[label];
    if (id) ids.add(id);
    else if (!NON_EXPERTISE_TAG_LABELS.has(label)) unknownLabels.push(label);
  }
  return { ids: [...ids], unknownLabels };
}

/** Individual LinkedIn profile URLs only (E-E-A-T sameAs). */
export function collectLinkedInProfileUrls(hrefs: readonly string[], baseOrigin: string): string[] {
  const list: string[] = [];
  const base = baseOrigin.replace(/\/$/, '');
  for (const hrefRaw of hrefs) {
    const href = hrefRaw.trim();
    if (!href || !/\/in\//i.test(href)) continue;
    let u = href;
    if (u.startsWith('//')) u = `https:${u}`;
    else if (u.startsWith('/')) u = `${base}${u}`;
    else if (!/^https?:/i.test(u)) continue;
    try {
      const url = new URL(u);
      const host = url.hostname.replace(/^www\./i, '');
      if (host !== 'linkedin.com' && !host.endsWith('.linkedin.com')) continue;
      const canon = `${url.origin}${url.pathname}`.replace(/\/+$/, '');
      if (!list.includes(canon)) list.push(canon);
    } catch {
      /* ignore bad href */
    }
  }
  return list;
}

export function collectLinkedInProfileUrlsFromMain(main: HTMLElement, baseOrigin: string): string[] {
  const hrefs: string[] = [];
  for (const a of main.querySelectorAll('a[href*="linkedin.com"]')) {
    const href = a.getAttribute('href');
    if (href) hrefs.push(href);
  }
  return collectLinkedInProfileUrls(hrefs, baseOrigin);
}

export function pickHeadshotFromMain(main: HTMLElement): string | null {
  const imgs = main.querySelectorAll('img[src*="cdn.prod.website-files.com"]');
  for (const im of imgs) {
    const src = im.getAttribute('src') || '';
    if (!/\.(jpe?g|webp|png)(\?|$)/i.test(src)) continue;
    if (/2000x1500|linkedin|Logotype|Arrow|icon\.svg|HENK|placeholder/i.test(src)) continue;
    if (/\.svg(\?|$)/i.test(src)) continue;
    return src.split('?')[0] ?? null;
  }
  return null;
}

export type ParsePersonHtmlResult =
  | { error: string; slug: string }
  | {
      slug: string;
      name: string;
      role: string;
      office: string;
      officeId: OfficeId;
      seniority: SeniorityId;
      expertise: ExpertiseId[];
      paragraphs: string[];
      photoUrl: string | null;
      sameAs: string[];
      unknownTagLabels: string[];
    };

export function parsePersonHtml(html: string, slug: string, baseOrigin = 'https://example.com'): ParsePersonHtmlResult {
  const root = parse(html);
  const main = root.querySelector('.main-wrapper');
  if (!main) return { error: 'no main-wrapper', slug };

  const title = root.querySelector('title')?.text?.trim() || '';
  const name = main.querySelector('h1')?.text?.trim() || slug;
  const roleDiv = main.querySelector('.people_template-role')?.text || '';
  const role = roleFromPage(title, name, roleDiv);

  const rt = main.querySelector('.w-richtext');
  const paragraphs = rt
    ? [...rt.querySelectorAll('p')]
        .map((p) => p.text.replace(/\s+/g, ' ').trim())
        .filter((t) => t.length > 3 && !/^[\u200b-\u200d\ufeff]+$/u.test(t))
    : [];

  const tagEls = main.querySelectorAll('.people-tags-for-filter [fs-cmsfilter-field="tags"]');
  const tagLabels = [...tagEls].map((el) => el.text.trim());
  const { ids: fromTags, unknownLabels: unknownTagLabels } = tagsToExpertiseFromLabels(tagLabels);
  let expertise: ExpertiseId[] = [...fromTags];
  const bioBlob = paragraphs.join(' ');
  if (expertise.length === 0) {
    expertise = inferExpertiseFromBio(role, paragraphs);
  }
  expertise = sortExpertiseIds(expertise);

  const officeId = inferOffice(role, bioBlob, name);
  const seniority = inferSeniority(`${role} ${name}`.toLowerCase());

  const photoUrl = pickHeadshotFromMain(main);
  const sameAs = collectLinkedInProfileUrlsFromMain(main, baseOrigin);
  const office = OFFICE_LABELS[officeId];

  return {
    slug,
    name,
    role,
    office,
    officeId,
    seniority,
    expertise,
    paragraphs,
    photoUrl,
    sameAs,
    unknownTagLabels,
  };
}
