import { describe, expect, it } from 'vitest';
import { platformAssessments } from './platform-assessments';

describe('platform assessment contract', () => {
  it('ensures each tool assessment contains required report sections', () => {
    const requiredToolIds = [
      'executive-exposure-audit',
      'headline-risk-assessment',
      'narrative-warfare-analyzer',
      'reputation-crisis-simulator',
      'ai-impersonation-exposure-audit',
    ];
    for (const id of requiredToolIds) {
      const assessment = platformAssessments[id];
      expect(assessment).toBeDefined();
      expect(assessment.assumptions.length).toBeGreaterThan(0);
      expect(assessment.recommendedPriorities.length).toBeGreaterThanOrEqual(3);
      expect(assessment.aiProvenance.length).toBeGreaterThan(0);
      expect(assessment.methodologyVersion.trim().length).toBeGreaterThan(0);
      expect(['low', 'moderate', 'high']).toContain(assessment.confidence);
      expect(['available', 'gated-live-engagement']).toContain(assessment.analystReviewState);
    }
  });
});
