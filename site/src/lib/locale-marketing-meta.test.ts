import { describe, expect, it } from 'vitest';
import { contactPageMeta, homePageMeta, peopleDirectoryMeta } from './locale-marketing-meta';

describe('locale-marketing-meta', () => {
  it('differentiates home title/description between UK and US', () => {
    const gb = homePageMeta('en-gb');
    const us = homePageMeta('en-us');
    expect(gb.title).not.toBe(us.title);
    expect(gb.description).not.toBe(us.description);
    expect(us.title).toContain('Americas');
  });

  it('differentiates people directory meta for IE', () => {
    const ie = peopleDirectoryMeta('en-ie');
    expect(ie.title).toContain('Ireland');
    expect(ie.description.toLowerCase()).toMatch(/dublin|miami|london/);
  });

  it('aligns contact JSON-LD entity name with title for US', () => {
    const us = contactPageMeta('en-us');
    expect(us.title).toBe(us.pageEntityName);
    expect(us.description).toContain('Miami');
  });
});
