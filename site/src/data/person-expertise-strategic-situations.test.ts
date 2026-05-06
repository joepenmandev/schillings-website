import { describe, expect, it } from 'vitest';
import { EXPERTISE_IDS } from './people-taxonomy';
import {
  EXPERTISE_RELATED_STRATEGIC_SITUATIONS,
  strategicSituationIdsForPersonExpertise,
} from './person-expertise-strategic-situations';
import { STRATEGIC_SITUATION_IDS } from './strategic-rebuild-content';

const situationSet = new Set<string>(STRATEGIC_SITUATION_IDS);

describe('person-expertise-strategic-situations', () => {
  it('maps every expertise id to known strategic situation ids', () => {
    for (const id of EXPERTISE_IDS) {
      const row = EXPERTISE_RELATED_STRATEGIC_SITUATIONS[id];
      expect(row).toBeDefined();
      expect(row!.length).toBeGreaterThan(0);
      for (const sid of row!) {
        expect(situationSet.has(sid)).toBe(true);
      }
    }
  });

  it('dedupes situations while preserving first-seen order', () => {
    const out = strategicSituationIdsForPersonExpertise(['reputation_privacy', 'communications']);
    expect(out.length).toBe(new Set(out).size);
    expect(out[0]).toBe('media_exposure_scrutiny');
  });

  it('returns empty when expertise is missing or empty', () => {
    expect(strategicSituationIdsForPersonExpertise(undefined)).toEqual([]);
    expect(strategicSituationIdsForPersonExpertise([])).toEqual([]);
  });
});
