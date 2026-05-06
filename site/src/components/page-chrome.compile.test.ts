import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import { transform, teardown } from '@astrojs/compiler';
import * as visualTokens from '../lib/visual-tokens';

const here = dirname(fileURLToPath(import.meta.url));

describe('page-chrome Astro modules', () => {
  for (const name of [
    'SectionKicker',
    'CtaConfidentialBand',
    'HubLinkCard',
    'StrategicBreadcrumb',
    'StrategicPageTitle',
  ]) {
    it(`${name}.astro compiles`, async () => {
      const path = join(here, `${name}.astro`);
      const source = readFileSync(path, 'utf8');
      const result = await transform(source, { filename: `/${name}.astro` });
      expect(result.code.length).toBeGreaterThan(0);
      const errors = result.diagnostics.filter((d) => d.severity === 1);
      expect(errors, JSON.stringify(result.diagnostics)).toEqual([]);
    });
  }
});

describe('visual-tokens', () => {
  it('exports non-empty strategic classes', () => {
    expect(visualTokens.SECTION_KICKER_CLASS).toContain('text-secondary-2');
    expect(visualTokens.HUB_LINK_CARD_ANCHOR_CLASS).toContain('rounded-sm');
    expect(visualTokens.CTA_CONFIDENTIAL_BUTTON_CLASS).toContain('bg-secondary-4');
    expect(visualTokens.STRATEGIC_CRUMB_LINK_CLASS).toContain('underline');
    expect(visualTokens.STRATEGIC_PAGE_H1_CLASS).toContain('font-serif');
    expect(visualTokens.PEOPLE_DIRECTORY_H1_CLASS).toContain('lg:text-[2.875rem]');
    expect(visualTokens.PEOPLE_PROFILE_H1_CLASS).toContain('lg:text-[2.75rem]');
    expect(visualTokens.NEWS_HUB_H1_CLASS).toContain('md:text-[2.45rem]');
    expect(visualTokens.NEWS_EDITORIAL_HEADLINE_CLASS).toContain('text-[#3c3b39]');
    expect(visualTokens.NEWS_MICRO_LABEL_CLASS).toContain('tracking-[0.18em]');
    expect(visualTokens.NEWS_MASTHEAD_INNER_CLASS).toContain('max-w-[min(88rem');
    expect(visualTokens.NEWS_TEXT_LINK_CLASS).toContain('decoration-secondary-2/40');
  });
});

afterAll(() => {
  teardown();
});
