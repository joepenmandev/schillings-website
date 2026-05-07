import { describe, expect, it } from 'vitest';
import { expertiseIdForNewsTopicSlug } from './news-topic-expertise-bridge';

describe('news-topic-expertise-bridge', () => {
  it('maps high-confidence editorial topic slugs to a primary expertise hub', () => {
    expect(expertiseIdForNewsTopicSlug('reputation')).toBe('reputation_privacy');
    expect(expertiseIdForNewsTopicSlug('investigations')).toBe('intelligence_security');
    expect(expertiseIdForNewsTopicSlug('security')).toBe('digital_resilience');
    expect(expertiseIdForNewsTopicSlug('geopolitics')).toBe('international');
    expect(expertiseIdForNewsTopicSlug('family-businesses')).toBe('corporate_transactions');
  });

  it('returns undefined for unmapped or neutral topics', () => {
    expect(expertiseIdForNewsTopicSlug('awards-rankings')).toBeUndefined();
    expect(expertiseIdForNewsTopicSlug('risk')).toBeUndefined();
    expect(expertiseIdForNewsTopicSlug('unknown-topic')).toBeUndefined();
  });
});
