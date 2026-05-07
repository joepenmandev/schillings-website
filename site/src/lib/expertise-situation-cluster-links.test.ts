import { describe, expect, it } from 'vitest';
import { EXPERTISE_IDS } from '../data/people-taxonomy';
import { STRATEGIC_SITUATION_IDS } from '../data/strategic-rebuild-content';
import {
  assertExpertiseSituationClusterIntegrity,
  EXPERTISE_LINKS_BY_SITUATION,
  expertiseLinksForSituation,
  SITUATION_LINKS_BY_EXPERTISE,
  situationLinksForExpertise,
} from './expertise-situation-cluster-links';

describe('expertise-situation-cluster-links', () => {
  it('passes integrity checks', () => {
    expect(() => assertExpertiseSituationClusterIntegrity()).not.toThrow();
  });

  it('covers every strategic situation id exactly once in the situation→expertise map', () => {
    const keys = new Set(Object.keys(EXPERTISE_LINKS_BY_SITUATION));
    for (const id of STRATEGIC_SITUATION_IDS) {
      expect(keys.has(id), `missing situation key ${id}`).toBe(true);
    }
    expect(keys.size).toBe(STRATEGIC_SITUATION_IDS.length);
  });

  it('covers every expertise id in the expertise→situation map', () => {
    for (const id of EXPERTISE_IDS) {
      expect(SITUATION_LINKS_BY_EXPERTISE[id]).toBeDefined();
    }
  });

  it('returns stable rows from helpers', () => {
    expect(expertiseLinksForSituation('high_stakes_litigation').length).toBe(1);
    expect(situationLinksForExpertise('corporate_transactions')).toEqual([]);
  });
});
