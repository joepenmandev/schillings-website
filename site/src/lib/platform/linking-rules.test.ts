import { describe, expect, it } from 'vitest';
import { linkedInsightsFor } from './linking-rules';

describe('platform linking rules', () => {
  it('returns deterministic results for a tool id', () => {
    const first = linkedInsightsFor('headline-risk-assessment');
    const second = linkedInsightsFor('headline-risk-assessment');
    expect(second).toEqual(first);
  });

  it('includes explicit reasons for every linked insight', () => {
    const toolIds = [
      'executive-exposure-audit',
      'headline-risk-assessment',
      'narrative-warfare-analyzer',
      'reputation-crisis-simulator',
      'ai-impersonation-exposure-audit',
    ];
    for (const id of toolIds) {
      const insights = linkedInsightsFor(id);
      expect(insights.length).toBeGreaterThan(0);
      for (const insight of insights) {
        expect(insight.reason.trim().length).toBeGreaterThan(10);
      }
    }
  });
});
