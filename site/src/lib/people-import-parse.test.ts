import { describe, it, expect } from 'vitest';
import { parse } from 'node-html-parser';
import {
  collectLinkedInProfileUrls,
  dedupeRoleGlitch,
  inferExpertiseFromBio,
  inferOffice,
  inferSeniority,
  normalizeImportedSeniority,
  parsePersonHtml,
  pickHeadshotFromMain,
  roleFromPage,
  sortExpertiseIds,
  tagsToExpertiseFromLabels,
} from './people-import-parse';

describe('tagsToExpertiseFromLabels', () => {
  it('maps CMS labels and ignores location-only tags', () => {
    const { ids, unknownLabels } = tagsToExpertiseFromLabels(['Privacy', 'London', 'Litigation']);
    expect(ids.sort()).toEqual(['litigation_disputes', 'reputation_privacy']);
    expect(unknownLabels).toEqual([]);
  });

  it('records unknown non-location labels', () => {
    const { unknownLabels } = tagsToExpertiseFromLabels(['London', 'Quantum Law']);
    expect(unknownLabels).toEqual(['Quantum Law']);
  });

  it('skips empty strings', () => {
    expect(tagsToExpertiseFromLabels(['', '  ', 'Privacy']).ids).toEqual(['reputation_privacy']);
  });
});

describe('sortExpertiseIds', () => {
  it('orders by people-taxonomy EXPERTISE_IDS and dedupes', () => {
    expect(sortExpertiseIds(['regulatory', 'reputation_privacy', 'regulatory', 'bogus'])).toEqual([
      'reputation_privacy',
      'regulatory',
    ]);
  });
});

describe('inferExpertiseFromBio', () => {
  it('infers when tag list would be empty', () => {
    const ids = inferExpertiseFromBio('Analyst', ['Our chief information security officer leads incident response.']);
    expect(ids).toContain('intelligence_security');
  });
});

describe('dedupeRoleGlitch', () => {
  it('collapses duplicated role fragments', () => {
    expect(dedupeRoleGlitch('Senior AssociateSenior Associate')).toBe('Senior Associate');
  });
});

describe('roleFromPage', () => {
  it('prefers title pattern over role div', () => {
    expect(roleFromPage('Jane Doe, Partner | Schillings', 'Jane Doe', 'Wrong')).toBe('Partner');
  });
});

describe('inferOffice / inferSeniority', () => {
  it('detects Dublin from copy', () => {
    expect(inferOffice('Lawyer', 'admitted in Ireland and Dublin', 'x')).toBe('dublin');
  });

  it('classifies partner', () => {
    expect(inferSeniority('partner in litigation')).toBe('partner');
  });

  it('classifies director before associate', () => {
    expect(inferSeniority('director, schillings communications')).toBe('director');
    expect(inferSeniority('associate director london')).toBe('director');
    expect(inferSeniority('associate london')).toBe('associate');
  });

  it('classifies senior associate before associate', () => {
    expect(inferSeniority('senior associate, schillings communications london')).toBe('senior_associate');
    expect(inferSeniority('associate london')).toBe('associate');
    expect(inferSeniority('solicitor london')).toBe('associate');
    expect(inferSeniority('senior solicitor london')).toBe('senior_associate');
  });

  it('classifies analyst rungs', () => {
    expect(inferSeniority('senior analyst london')).toBe('senior_analyst');
    expect(inferSeniority('junior analyst')).toBe('analyst');
    expect(inferSeniority('analyst london')).toBe('analyst');
  });

  it('maps counsel and consultant to senior associate tier', () => {
    expect(inferSeniority('consultant')).toBe('senior_associate');
    expect(inferSeniority('of counsel')).toBe('senior_associate');
  });

  it('classifies advisory board from role or combined text', () => {
    expect(inferSeniority('advisory board')).toBe('advisory_board');
    expect(inferSeniority('member schillings advisory board')).toBe('advisory_board');
  });

  it('classifies ceo and founder from combined role/bio text', () => {
    expect(inferSeniority('chief executive officer')).toBe('ceo');
    expect(inferSeniority('partner london founded schillings in 1984')).toBe('founder');
  });

  it('classifies CISO / CIO / CTO before generic officer tier', () => {
    expect(inferSeniority('chief information security officer')).toBe('ciso');
    expect(inferSeniority('chief information officer')).toBe('ciso');
    expect(inferSeniority('chief technology officer, london')).toBe('ciso');
  });

  it('normalizes legacy counsel id and upgrades associate from role', () => {
    expect(normalizeImportedSeniority('counsel', 'Consultant')).toBe('senior_associate');
    expect(normalizeImportedSeniority('associate', 'Senior Associate London')).toBe('senior_associate');
    expect(normalizeImportedSeniority('associate', 'Senior Analyst London')).toBe('senior_analyst');
    expect(normalizeImportedSeniority('associate', 'Analyst London')).toBe('analyst');
  });

  it('upgrades business_services to director when role is director', () => {
    expect(normalizeImportedSeniority('business_services', 'Director, Schillings Communications')).toBe('director');
  });

  it('re-infers from role when stored seniority is other', () => {
    expect(normalizeImportedSeniority('other', 'Senior Analyst London')).toBe('senior_analyst');
    expect(normalizeImportedSeniority('other', 'Partner')).toBe('partner');
    expect(normalizeImportedSeniority('other', 'Mystery title')).toBe('other');
  });

  it('detects advisory board from bio when stored seniority is other', () => {
    expect(
      normalizeImportedSeniority(
        'other',
        'Member',
        'In addition to his appointment to the Schillings advisory board, Sir George also serves…',
      ),
    ).toBe('advisory_board');
  });

  it('upgrades stored partner to ceo from role or founder from bio', () => {
    expect(normalizeImportedSeniority('partner', 'Chief Executive Officer')).toBe('ceo');
    expect(
      normalizeImportedSeniority(
        'partner',
        'Partner',
        'Keith founded Schillings and advises clients on commercial disputes.',
      ),
    ).toBe('founder');
  });

  it('upgrades business_services to ciso for chief officer titles', () => {
    expect(normalizeImportedSeniority('business_services', 'Chief Information Security Officer')).toBe('ciso');
  });
});

describe('collectLinkedInProfileUrls', () => {
  const base = 'https://schillingspartners.com';

  it('normalises protocol-relative and absolute /in/ profile links', () => {
    const urls = collectLinkedInProfileUrls(
      ['//www.linkedin.com/in/foo/', 'https://www.linkedin.com/in/bar/'],
      base,
    );
    expect(urls).toEqual(['https://www.linkedin.com/in/foo', 'https://www.linkedin.com/in/bar']);
  });

  it('drops company pages and non-LinkedIn hosts', () => {
    expect(
      collectLinkedInProfileUrls(
        ['https://www.linkedin.com/company/schillings', 'https://evil.com/in/fake'],
        base,
      ),
    ).toEqual([]);
  });
});

describe('pickHeadshotFromMain', () => {
  it('returns first plausible Webflow CDN raster', () => {
    const main = parse(
      `<div class="main-wrapper"><img src="https://cdn.prod.website-files.com/x/photo-800x600.jpg?q=1"/></div>`,
    ).querySelector('.main-wrapper')!;
    expect(pickHeadshotFromMain(main)).toBe('https://cdn.prod.website-files.com/x/photo-800x600.jpg');
  });

  it('skips blocked patterns', () => {
    const main = parse(
      `<div class="main-wrapper"><img src="https://cdn.prod.website-files.com/x/linkedin-banner.png"/></div>`,
    ).querySelector('.main-wrapper')!;
    expect(pickHeadshotFromMain(main)).toBeNull();
  });
});

describe('parsePersonHtml', () => {
  it('returns error without main-wrapper', () => {
    expect(parsePersonHtml('<html><body></body></html>', 'x')).toEqual({ error: 'no main-wrapper', slug: 'x' });
  });

  it('parses tags, LinkedIn, and bio fallback', () => {
    const html = `<!DOCTYPE html><html><head><title>Ann Smith, Associate | Schillings</title></head><body>
      <div class="main-wrapper">
        <h1>Ann Smith</h1>
        <div class="people_template-role">Associate</div>
        <div class="w-richtext"><p>Ann Smith works on defamation and privacy matters.</p></div>
        <div class="people-tags-for-filter"><span fs-cmsfilter-field="tags">London</span></div>
        <a href="https://uk.linkedin.com/in/ann-smith/">LinkedIn</a>
      </div></body></html>`;
    const r = parsePersonHtml(html, 'ann-smith');
    expect('error' in r).toBe(false);
    if ('error' in r) return;
    expect(r.name).toBe('Ann Smith');
    expect(r.role).toBe('Associate');
    expect(r.expertise).toContain('reputation_privacy');
    expect(r.sameAs).toContain('https://uk.linkedin.com/in/ann-smith');
  });
});
