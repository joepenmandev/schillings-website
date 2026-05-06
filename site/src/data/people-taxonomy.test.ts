import { describe, expect, it } from 'vitest';
import {
  EXPERTISE_IDS,
  EXPERTISE_LABELS,
  PRACTICE_GROUP_IDS,
  PRACTICE_GROUP_LABELS,
} from './people-taxonomy';

describe('people-taxonomy public labels', () => {
  it('does not use internal department codes as primary practice-group labels', () => {
    const banned = /\bISD\b|\bDR\b|\bSCOM\b/;
    for (const id of PRACTICE_GROUP_IDS) {
      expect(PRACTICE_GROUP_LABELS[id]).not.toMatch(banned);
      expect(PRACTICE_GROUP_LABELS[id].trim().length).toBeGreaterThan(3);
    }
  });

  it('keeps unique expertise display labels for every ExpertiseId', () => {
    const labels = EXPERTISE_IDS.map((id) => EXPERTISE_LABELS[id]);
    expect(new Set(labels).size).toBe(EXPERTISE_IDS.length);
    for (const id of EXPERTISE_IDS) {
      expect(EXPERTISE_LABELS[id].trim().length).toBeGreaterThan(2);
    }
  });
});
