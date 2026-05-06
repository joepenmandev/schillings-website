import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pagesRoot = fileURLToPath(new URL('../../pages/executive-intelligence-platform', import.meta.url));
const toolsPage = `${pagesRoot}/tools/[toolId]/index.astro`;
const methodologyPage = `${pagesRoot}/methodology/index.astro`;

describe('platform hardening contracts', () => {
  it('keeps all platform routes noindex', () => {
    const pageFiles = [
      `${pagesRoot}/index.astro`,
      `${pagesRoot}/manifesto/index.astro`,
      `${pagesRoot}/lexicon/index.astro`,
      `${pagesRoot}/exposure/index.astro`,
      `${pagesRoot}/narrative/index.astro`,
      `${pagesRoot}/crisis/index.astro`,
      `${pagesRoot}/methodology/index.astro`,
      `${pagesRoot}/methodology/[indexId]/index.astro`,
      `${pagesRoot}/tools/[toolId]/index.astro`,
    ];
    for (const file of pageFiles) {
      const source = readFileSync(file, 'utf8');
      expect(source).toMatch(/\bnoindex\b/);
    }
  });

  it('tool route renders refusal panel and deterministic-draft mode', () => {
    const source = readFileSync(toolsPage, 'utf8');
    expect(source).toContain('assessmentMode="deterministic-draft"');
    expect(source).toContain('<RefusalPolicyPanel');
  });

  it('methodology route sources decision defaults from shared data', () => {
    const source = readFileSync(methodologyPage, 'utf8');
    expect(source).toContain('platformDecisionDefaults');
  });
});
