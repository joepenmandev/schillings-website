import { describe, expect, it } from 'vitest';
import { findSoftTermHits } from './audit-strategic-copy-scan';

describe('audit-strategic-copy-scan', () => {
  it('does not treat "leading" inside "misleading" as the claims term leading', () => {
    expect(findSoftTermHits('A misleading narrative')).toEqual({ banned: [], claims: [] });
  });

  it('detects whole-word leading', () => {
    expect(findSoftTermHits('We are leading the response').claims).toContain('leading');
  });

  it('detects multi-word phrases by substring', () => {
    expect(findSoftTermHits('Our number one priority').claims).toContain('number one');
  });
});
