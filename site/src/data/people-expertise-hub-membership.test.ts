import { describe, expect, it } from 'vitest';
import { publishedPeople } from './people';
import type { ExpertiseId } from './people-taxonomy';
import {
  ALLOW_DIGITAL_RESILIENCE_TAG_NON_DR_EFFECTIVE,
  ALLOW_DR_EFFECTIVE_WITHOUT_DIGITAL_RESILIENCE_TAG,
  ALLOW_LITIGATION_EXPERTISE_NON_LEGAL_EFFECTIVE,
} from './people-expertise-hub-allowlists';
import { resolvePersonPracticeGroup } from '../lib/people-directory';
import { inferPracticeGroup } from '../lib/people-practice-group';

const allowLit = new Set(ALLOW_LITIGATION_EXPERTISE_NON_LEGAL_EFFECTIVE);
const allowDrTagNonDr = new Set(ALLOW_DIGITAL_RESILIENCE_TAG_NON_DR_EFFECTIVE);
const allowDrNoTag = new Set(ALLOW_DR_EFFECTIVE_WITHOUT_DIGITAL_RESILIENCE_TAG);

describe('people expertise hub membership vs directory practice group', () => {
  it('does not place non-legal bylines on the litigation-disputes hub unless allowlisted', () => {
    const bad: string[] = [];
    for (const p of publishedPeople()) {
      if (p.draft) continue;
      const exp = p.expertise ?? [];
      if (!exp.includes('litigation_disputes')) continue;
      const effective = resolvePersonPracticeGroup(p);
      if (effective !== 'legal' && !allowLit.has(p.slug)) {
        bad.push(`${p.slug} (effective=${effective}, import=${p.practiceGroup ?? '—'})`);
      }
    }
    expect(bad, bad.join('; ')).toEqual([]);
  });

  it('requires digital_resilience hub tag when directory resolves to dr, unless allowlisted', () => {
    const bad: string[] = [];
    for (const p of publishedPeople()) {
      if (p.draft) continue;
      const effective = resolvePersonPracticeGroup(p);
      if (effective !== 'dr') continue;
      const exp = p.expertise ?? [];
      if (!exp.includes('digital_resilience') && !allowDrNoTag.has(p.slug)) {
        bad.push(p.slug);
      }
    }
    expect(bad, bad.join('; ')).toEqual([]);
  });

  it('requires dr byline when carrying digital_resilience tag, unless allowlisted', () => {
    const bad: string[] = [];
    for (const p of publishedPeople()) {
      if (p.draft) continue;
      const exp = p.expertise ?? [];
      if (!exp.includes('digital_resilience')) continue;
      const effective = resolvePersonPracticeGroup(p);
      if (effective !== 'dr' && !allowDrTagNonDr.has(p.slug)) {
        bad.push(`${p.slug} (effective=${effective})`);
      }
    }
    expect(bad, bad.join('; ')).toEqual([]);
  });

  it('infers dr when digital_resilience is present alongside intelligence_security', () => {
    expect(inferPracticeGroup('Associate London', ['digital_resilience', 'intelligence_security'] as ExpertiseId[])).toBe(
      'dr',
    );
  });

  it('infers dr when digital_resilience is present alongside communications', () => {
    expect(inferPracticeGroup('Associate London', ['communications', 'digital_resilience'] as ExpertiseId[])).toBe('dr');
  });
});
