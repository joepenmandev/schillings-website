import { describe, expect, it } from 'vitest';
import { platformTools } from '../platform-docs';

describe('platform tool docs metadata', () => {
  it('enforces refusal limits for every tool', () => {
    for (const tool of platformTools) {
      expect(tool.refusalLimits.length).toBeGreaterThanOrEqual(3);
      for (const item of tool.refusalLimits) {
        expect(item.toLowerCase()).toContain('does not');
      }
    }
  });
});
