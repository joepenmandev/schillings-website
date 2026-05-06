import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

function violationSummary(violations: { id: string; help: string; nodes: { html: string }[] }[]): string {
  return violations
    .map((v) => `${v.id}: ${v.help}\n  ${v.nodes.map((n) => n.html).join('\n  ')}`)
    .join('\n---\n');
}

test.describe('a11y — contact', () => {
  test('main landmark has no axe violations', async ({ page }) => {
    await page.goto('/contact/', { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Contact us' })).toBeVisible();
    const results = await new AxeBuilder({ page }).include('#main').analyze();
    expect(results.violations, violationSummary(results.violations)).toEqual([]);
  });
});
