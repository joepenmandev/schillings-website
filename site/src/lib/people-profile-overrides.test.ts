import { describe, it, expect } from 'vitest';
import { getPersonBySlug } from '../data/people';

describe('people-profile-overrides', () => {
  it('applies director role and seniority for Charlie Lait', () => {
    const p = getPersonBySlug('charlie-lait');
    expect(p).toBeTruthy();
    expect(p!.seniority).toBe('director');
    expect(p!.role).toBe('Director');
  });

  it('sets David Imison display role and seniority to CEO', () => {
    const p = getPersonBySlug('david-imison');
    expect(p?.role).toBe('Chief Executive Officer');
    expect(p?.seniority).toBe('ceo');
  });

  it('promotes Keith Schilling to founder when bio records founding the firm', () => {
    expect(getPersonBySlug('keith-schilling')?.seniority).toBe('founder');
  });

  it('sets Craig Edwards to CISO tier', () => {
    expect(getPersonBySlug('craig-edwards')?.seniority).toBe('ciso');
    expect(getPersonBySlug('craig-edwards')?.role).toBe('Chief Information Security Officer');
  });

  it('applies advisory board for Lord Browne and Sir Mark', () => {
    const lord = getPersonBySlug('lord-browne-of-madingley');
    expect(lord?.seniority).toBe('advisory_board');
    expect(lord?.role).toBe('Advisory Board');
    const mark = getPersonBySlug('sir-mark-lyall-grant');
    expect(mark?.seniority).toBe('advisory_board');
  });
});
