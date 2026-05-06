import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const siteDir = fileURLToPath(new URL('../..', import.meta.url));

describe('audit: Consent Mode defaults before analytics (prep)', () => {
  it('Base layout loads ConsentModeDefaults in <head>', () => {
    const base = readFileSync(`${siteDir}/src/layouts/Base.astro`, 'utf8');
    expect(base).toMatch(/import\s+ConsentModeDefaults/);
    expect(base).toMatch(/<ConsentModeDefaults\b/);
    const headClose = base.indexOf('</head>');
    const consentIdx = base.indexOf('<ConsentModeDefaults');
    expect(consentIdx).toBeGreaterThan(-1);
    expect(headClose).toBeGreaterThan(-1);
    expect(consentIdx).toBeLessThan(headClose);
  });

  it('ConsentModeDefaults.astro exists and sets default consent', () => {
    const raw = readFileSync(`${siteDir}/src/components/ConsentModeDefaults.astro`, 'utf8');
    expect(raw).toMatch(/gtag\s*\(\s*['"]consent['"]\s*,\s*['"]default['"]/);
    expect(raw).toMatch(/denied/);
  });
});
