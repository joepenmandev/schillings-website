import { describe, it, expect } from 'vitest';
import { EXPERTISE_IDS } from '../data/people-taxonomy';
import { getServiceHubCopy } from './service-hub-copy';

describe('getServiceHubCopy', () => {
  it('returns intro and legalNote for every practice hub id', () => {
    for (const id of EXPERTISE_IDS) {
      const c = getServiceHubCopy(id);
      expect(c.intro.length).toBeGreaterThan(20);
      expect(c.legalNote.length).toBeGreaterThan(20);
    }
  });
});
