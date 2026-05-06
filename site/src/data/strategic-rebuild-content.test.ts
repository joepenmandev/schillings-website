import { describe, expect, it } from 'vitest';
import { EXPERTISE_IDS } from './people-taxonomy';
import {
  getAllSituationPathSlugs,
  getAllWhatWeProtectPathSlugs,
  getExpertiseIndexGraphHubEntries,
  getServicesIndexPublicExpertiseCards,
  getSituationDetailById,
  getSituationDetailBySlug,
  getStrategicHubPageModel,
  getStrategicInternalDepartmentLabel,
  getStrategicPublicExpertiseById,
  getStrategicSituationDetailModel,
  getWhatWeProtectDetailById,
  getWhatWeProtectDetailBySlug,
  homeHero,
  homeResponseSystemTagline,
  homeWhenClientsComeToUs,
  responseSystemPage,
  situationDetailsById,
  situationIdFromPathSlug,
  situationPathSlug,
  situations,
  STRATEGIC_INTERNAL_DEPARTMENT_CODES,
  STRATEGIC_INTERNAL_DEPARTMENT_LABELS,
  EXPERTISE_INDEX_PATH_SEGMENT,
  STRATEGIC_PUBLIC_EXPERTISE,
  STRATEGIC_PUBLIC_EXPERTISE_LABELS,
  STRATEGIC_PUBLIC_EXPERTISE_SERVICE_HUB_BY_ID,
  STRATEGIC_RESPONSE_SYSTEM_IDS,
  STRATEGIC_SITUATION_IDS,
  STRATEGIC_WHAT_WE_PROTECT_IDS,
  whatWeProtect,
  whatWeProtectDetailsById,
  whatWeProtectIdFromPathSlug,
  whatWeProtectPathSlug,
  responseSystem,
} from './strategic-rebuild-content';

function nonEmptyStrings(values: readonly string[]): boolean {
  return values.every((s) => typeof s === 'string' && s.trim().length > 0);
}

describe('strategic-rebuild-content homepage', () => {
  it('defines hero copy for all locales', () => {
    expect(homeHero.headline).toContain('Protecting reputation');
    expect(homeHero.subheadline).toContain('Schillings combines');
  });

  it('gives every what-we-protect homepage card a resolvable detail slug', () => {
    for (const w of whatWeProtect) {
      const slug = whatWeProtectPathSlug(w.id);
      expect(getWhatWeProtectDetailById(w.id).slug).toBe(slug);
      expect(whatWeProtectIdFromPathSlug(slug)).toBe(w.id);
    }
  });

  it('lists eight client-entry scenarios', () => {
    expect(homeWhenClientsComeToUs).toHaveLength(8);
  });

  it('aligns homepage response tagline with response system page model', () => {
    expect(homeResponseSystemTagline).toBe(responseSystemPage.tagline);
    expect(homeResponseSystemTagline.length).toBeGreaterThan(20);
  });
});

describe('strategic-rebuild-content situations index', () => {
  it('lists twelve situations in catalogue order with titles matching detail models', () => {
    expect(STRATEGIC_SITUATION_IDS).toHaveLength(12);
    expect(situations.map((s) => s.id)).toEqual([...STRATEGIC_SITUATION_IDS]);
    for (const id of STRATEGIC_SITUATION_IDS) {
      expect(situations.find((s) => s.id === id)?.label).toBe(getSituationDetailById(id).title);
    }
  });
});

describe('strategic-rebuild-content situation detail models', () => {
  it('has unique situation ids and slugs with round-trip slug helpers', () => {
    const slugs = new Set<string>();
    for (const id of STRATEGIC_SITUATION_IDS) {
      const d = getSituationDetailById(id);
      expect(d.id).toBe(id);
      expect(d.slug).toBe(situationPathSlug(id));
      expect(slugs.has(d.slug)).toBe(false);
      slugs.add(d.slug);
      expect(situationIdFromPathSlug(d.slug)).toBe(id);
      expect(getSituationDetailBySlug(d.slug)?.id).toBe(id);
    }
    expect(slugs.size).toBe(STRATEGIC_SITUATION_IDS.length);
  });

  it('covers every situation id with non-empty metadata and arrays', () => {
    for (const id of STRATEGIC_SITUATION_IDS) {
      const d = situationDetailsById[id];
      expect(d.title.trim().length).toBeGreaterThan(0);
      expect(d.metaTitle.trim().length).toBeGreaterThan(0);
      expect(d.metaDescription.trim().length).toBeGreaterThan(40);
      expect(d.lead.trim().length).toBeGreaterThan(20);
      expect(d.howSchillingsResponds.trim().length).toBeGreaterThan(20);
      expect(d.ctaLabel.trim().length).toBeGreaterThan(0);
      expect(d.whenThisMatters.length).toBeGreaterThan(0);
      expect(d.risksIfMishandled.length).toBeGreaterThan(0);
      expect(nonEmptyStrings(d.whenThisMatters)).toBe(true);
      expect(nonEmptyStrings(d.risksIfMishandled)).toBe(true);
      expect(d.relatedProtectiveAssets.length).toBeGreaterThan(0);
      expect(d.relatedResponsePillars.length).toBeGreaterThan(0);
    }
  });

  it('round-trips path slugs via getAllSituationPathSlugs', () => {
    for (const id of STRATEGIC_SITUATION_IDS) {
      const slug = situationPathSlug(id);
      expect(getAllSituationPathSlugs()).toContain(slug);
    }
    expect(getAllSituationPathSlugs()).toHaveLength(STRATEGIC_SITUATION_IDS.length);
  });

  it('maps legacy page model from situation detail', () => {
    const m = getStrategicSituationDetailModel('high_stakes_litigation');
    expect(m.pathSlug).toBe('high-stakes-litigation');
    expect(m.label).toContain('High-Stakes Litigation');
    expect(m.title).toContain('Schillings');
    expect(m.paragraphs.length).toBeGreaterThan(0);
  });

  it('references only valid protective assets and response pillars for every situation', () => {
    for (const id of STRATEGIC_SITUATION_IDS) {
      const d = getSituationDetailById(id);
      for (const assetId of d.relatedProtectiveAssets) {
        expect(STRATEGIC_WHAT_WE_PROTECT_IDS).toContain(assetId);
        expect(getWhatWeProtectDetailById(assetId).title.length).toBeGreaterThan(0);
      }
      for (const pillarId of d.relatedResponsePillars) {
        expect(STRATEGIC_RESPONSE_SYSTEM_IDS).toContain(pillarId);
      }
    }
  });
});

describe('strategic-rebuild-content what-we-protect detail models', () => {
  it('has unique asset ids and slugs with reverse lookup', () => {
    const slugs = new Set<string>();
    for (const id of STRATEGIC_WHAT_WE_PROTECT_IDS) {
      const d = getWhatWeProtectDetailById(id);
      expect(d.id).toBe(id);
      expect(d.slug).toBe(whatWeProtectPathSlug(id));
      expect(slugs.has(d.slug)).toBe(false);
      slugs.add(d.slug);
      expect(whatWeProtectIdFromPathSlug(d.slug)).toBe(id);
      expect(getWhatWeProtectDetailBySlug(d.slug)?.id).toBe(id);
    }
  });

  it('covers every protective asset with non-empty metadata', () => {
    for (const id of STRATEGIC_WHAT_WE_PROTECT_IDS) {
      const d = whatWeProtectDetailsById[id];
      expect(d.metaDescription.length).toBeGreaterThan(40);
      expect(d.whyItMatters.length).toBeGreaterThan(0);
      expect(d.commonRisks.length).toBeGreaterThan(0);
      expect(nonEmptyStrings(d.whyItMatters)).toBe(true);
      expect(nonEmptyStrings(d.commonRisks)).toBe(true);
      expect(d.relatedSituations.length).toBeGreaterThan(0);
      expect(d.relatedResponsePillars.length).toBeGreaterThan(0);
    }
  });

  it('lists all what-we-protect slugs', () => {
    expect(getAllWhatWeProtectPathSlugs()).toHaveLength(STRATEGIC_WHAT_WE_PROTECT_IDS.length);
  });

  it('keeps related situations and response pillars aligned with catalogue ids', () => {
    for (const id of STRATEGIC_WHAT_WE_PROTECT_IDS) {
      const d = getWhatWeProtectDetailById(id);
      for (const situationId of d.relatedSituations) {
        expect(STRATEGIC_SITUATION_IDS).toContain(situationId);
        expect(getSituationDetailById(situationId).title.length).toBeGreaterThan(0);
        expect(situationPathSlug(situationId)).toBeTruthy();
      }
      for (const pillarId of d.relatedResponsePillars) {
        expect(STRATEGIC_RESPONSE_SYSTEM_IDS).toContain(pillarId);
      }
    }
  });

  it('has unique meta titles per protective asset', () => {
    const titles = new Set<string>();
    for (const id of STRATEGIC_WHAT_WE_PROTECT_IDS) {
      const t = getWhatWeProtectDetailById(id).metaTitle.trim();
      expect(titles.has(t)).toBe(false);
      titles.add(t);
    }
  });
});

describe('strategic-rebuild-content response system page model', () => {
  it('has complete non-empty page fields', () => {
    const p = responseSystemPage;
    expect(p.title.trim().length).toBeGreaterThan(0);
    expect(p.metaTitle.trim().length).toBeGreaterThan(0);
    expect(p.metaDescription.length).toBeGreaterThan(40);
    expect(p.lead.length).toBeGreaterThan(20);
    expect(p.tagline.length).toBeGreaterThan(20);
    expect(p.howItWorks.length).toBeGreaterThan(40);
    expect(p.ctaLabel.trim().length).toBeGreaterThan(0);
    expect(p.pillars).toEqual(responseSystem);
    expect(p.supportedSituations.length).toBe(STRATEGIC_SITUATION_IDS.length);
    expect(p.protectedAssets.length).toBe(STRATEGIC_WHAT_WE_PROTECT_IDS.length);
  });

  it('lists full situation and asset catalogues for hub link grids', () => {
    expect(responseSystemPage.supportedSituations).toEqual([...STRATEGIC_SITUATION_IDS]);
    expect(responseSystemPage.protectedAssets).toEqual([...STRATEGIC_WHAT_WE_PROTECT_IDS]);
  });
});

describe('strategic-rebuild-content derived lists', () => {
  it('keeps situations and whatWeProtect aligned with detail titles', () => {
    expect(situations).toHaveLength(STRATEGIC_SITUATION_IDS.length);
    expect(whatWeProtect).toHaveLength(STRATEGIC_WHAT_WE_PROTECT_IDS.length);
    expect(situations[0]?.label).toBe(situationDetailsById[situations[0]!.id].title);
    expect(whatWeProtect[0]?.label).toBe(whatWeProtectDetailsById[whatWeProtect[0]!.id].title);
  });
});

describe('strategic-rebuild-content expertise index public cards', () => {
  it('keeps one row per public expertise with optional hub links only to real ExpertiseId slugs', () => {
    const cards = getServicesIndexPublicExpertiseCards();
    expect(cards).toHaveLength(STRATEGIC_PUBLIC_EXPERTISE.length);
    for (const row of cards) {
      expect(STRATEGIC_PUBLIC_EXPERTISE_LABELS[row.id]).toBe(row.label);
      const hub = STRATEGIC_PUBLIC_EXPERTISE_SERVICE_HUB_BY_ID[row.id];
      expect(row.linkedExpertiseId).toBe(hub);
      if (hub !== null) {
        expect(EXPERTISE_IDS).toContain(hub);
      }
    }
  });

  it('emits JSON-LD hub entries under EXPERTISE_INDEX_PATH_SEGMENT', () => {
    const hubs = getExpertiseIndexGraphHubEntries();
    const base = EXPERTISE_INDEX_PATH_SEGMENT;
    expect(hubs).toHaveLength(8);
    for (const h of hubs) {
      expect(h.pathAfterLocale === base || h.pathAfterLocale.startsWith(`${base}/`)).toBe(true);
      if (h.pathAfterLocale !== base) {
        const slug = h.pathAfterLocale.slice(`${base}/`.length);
        expect(EXPERTISE_IDS).toContain(slug);
      }
    }
  });

});

describe('strategic-rebuild-content public expertise mapping', () => {
  it('lists eight public expertise rows with unique ids and unique labels', () => {
    expect(STRATEGIC_PUBLIC_EXPERTISE).toHaveLength(8);
    const ids = new Set(STRATEGIC_PUBLIC_EXPERTISE.map((e) => e.id));
    const labels = new Set(STRATEGIC_PUBLIC_EXPERTISE.map((e) => e.label));
    expect(ids.size).toBe(8);
    expect(labels.size).toBe(8);
    for (const row of STRATEGIC_PUBLIC_EXPERTISE) {
      expect(row.label.trim().length).toBeGreaterThan(0);
      expect(getStrategicPublicExpertiseById(row.id)).toEqual(row);
      expect(STRATEGIC_PUBLIC_EXPERTISE_LABELS[row.id]).toBe(row.label);
    }
  });

  it('does not use internal department codes as primary public labels', () => {
    const banned = new Set(['ISD', 'DR', 'SCOM']);
    for (const { label } of STRATEGIC_PUBLIC_EXPERTISE) {
      expect(banned.has(label)).toBe(false);
    }
  });

  it('maps every internal department code to a non-empty expanded label', () => {
    for (const code of STRATEGIC_INTERNAL_DEPARTMENT_CODES) {
      const label = STRATEGIC_INTERNAL_DEPARTMENT_LABELS[code];
      expect(label.trim().length).toBeGreaterThan(5);
      expect(getStrategicInternalDepartmentLabel(code)).toBe(label);
      expect(bannedInternalCodesInLabel(label)).toBe(false);
    }
  });
});

function bannedInternalCodesInLabel(label: string): boolean {
  return /\bISD\b|\bDR\b|\bSCOM\b/.test(label);
}

describe('strategic-rebuild-content hub pages', () => {
  it('builds situations model from central situation list', () => {
    const m = getStrategicHubPageModel('situations');
    expect(m.listItems).toHaveLength(situations.length);
    expect(m.listItems[0]?.primary).toBe(situations[0]?.label);
    expect(m.title).toContain('Situations');
    expect(m.metaDescription.length).toBeGreaterThan(40);
  });

  it('builds what-we-protect model from whatWeProtect list', () => {
    const m = getStrategicHubPageModel('what-we-protect');
    expect(m.listItems).toHaveLength(whatWeProtect.length);
    expect(m.heading).toBe('What We Protect');
  });

  it('includes secondary lines for response-system pillars', () => {
    const m = getStrategicHubPageModel('response-system');
    expect(m.listItems).toHaveLength(responseSystem.length);
    expect(m.listItems.every((i) => i.secondary)).toBe(true);
  });
});
