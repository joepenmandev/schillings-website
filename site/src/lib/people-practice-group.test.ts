import { describe, it, expect } from 'vitest';
import { inferPracticeGroup, resolvePracticeGroup } from './people-practice-group';

describe('inferPracticeGroup', () => {
  it('detects Schillings Communications from role', () => {
    expect(inferPracticeGroup('Senior Associate, Schillings Communications London', [])).toBe('scom');
    expect(inferPracticeGroup('Partner, Schillings Communications LLP', ['reputation_privacy'])).toBe('scom');
  });

  it('detects ISD from role', () => {
    expect(inferPracticeGroup('Chief Information Security Officer', ['intelligence_security'])).toBe('isd');
    expect(inferPracticeGroup('Senior Analyst London', [])).toBe('isd');
    expect(inferPracticeGroup('Analyst London', [])).toBe('isd');
  });

  it('routes litigators to legal, not digital resilience', () => {
    expect(inferPracticeGroup('Partner', ['litigation_disputes'])).toBe('legal');
    expect(inferPracticeGroup('Solicitor, commercial litigation', ['reputation_privacy'])).toBe('legal');
  });

  it('detects digital resilience from bio hints', () => {
    expect(
      inferPracticeGroup('Associate London', ['reputation_privacy'], 'works within Digital Resilience practice.'),
    ).toBe('dr');
    expect(
      inferPracticeGroup(
        'Associate London',
        ['communications'],
        'Meg works within the social media strategy team of Schillings’ Digital Resilience practice.',
      ),
    ).toBe('dr');
    expect(
      inferPracticeGroup(
        'Associate London',
        ['reputation_privacy', 'intelligence_security', 'communications'],
        'With deep expertise in search engines and generative AI, Lauren provides strategic analysis.',
      ),
    ).toBe('dr');
  });

  it('defaults to legal for typical lawyers', () => {
    expect(inferPracticeGroup('Partner', ['reputation_privacy'])).toBe('legal');
    expect(inferPracticeGroup('Associate London', ['reputation_privacy'])).toBe('legal');
  });

  it('routes lawyer bios to legal even with intelligence_security tagging', () => {
    expect(
      inferPracticeGroup(
        'Partner',
        ['reputation_privacy', 'intelligence_security', 'international'],
        'Jenny is a leading media lawyer advising on defamation and privacy.',
      ),
    ).toBe('legal');
    expect(
      inferPracticeGroup(
        'Partner',
        ['intelligence_security', 'corporate_transactions', 'regulatory'],
        'Partner in a city law firm leading complex investigations through legal proceedings.',
      ),
    ).toBe('legal');
  });

  it('uses communications expertise when role is generic', () => {
    expect(inferPracticeGroup('Director', ['communications'])).toBe('scom');
  });

  it('routes digital_resilience expertise tag to dr before isd', () => {
    expect(inferPracticeGroup('Associate London', ['digital_resilience', 'intelligence_security'])).toBe('dr');
  });

  it('prefers dr over communications when both expertise tags are present', () => {
    expect(inferPracticeGroup('Associate London', ['communications', 'digital_resilience'])).toBe('dr');
  });
});

describe('resolvePracticeGroup', () => {
  it('uses explicit department when valid', () => {
    expect(resolvePracticeGroup('Partner', ['litigation_disputes'], 'legal')).toBe('legal');
    expect(resolvePracticeGroup('Analyst London', [], 'isd')).toBe('isd');
  });

  it('ignores invalid explicit and falls back to inference', () => {
    expect(resolvePracticeGroup('Partner', ['reputation_privacy'], 'not-a-department')).toBe('legal');
  });
});
