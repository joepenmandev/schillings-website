import { describe, expect, it } from 'vitest';
import { buildSiteWideJsonLdGraph } from './jsonld-organization';
import { logoImageObjectId, organizationNodeId, websiteNodeId } from './jsonld-entity-ids';

const ORIGIN = 'https://www.example.com';

describe('jsonld-entity-ids', () => {
  it('normalizes origin and builds stable @ids', () => {
    expect(organizationNodeId(`${ORIGIN}/`)).toBe(`${ORIGIN}/#organization`);
    expect(websiteNodeId(ORIGIN, 'en-gb')).toBe(`${ORIGIN}/#website`);
    expect(websiteNodeId(ORIGIN, 'en-us')).toBe(`${ORIGIN}/us/#website`);
    expect(websiteNodeId(ORIGIN, 'en-ie')).toBe(`${ORIGIN}/ie/#website`);
    expect(logoImageObjectId(ORIGIN)).toBe(`${ORIGIN}/#logo`);
  });
});

describe('buildSiteWideJsonLdGraph', () => {
  it('emits @graph with ImageObject, Organization, WebSite and cross-links', () => {
    const g = buildSiteWideJsonLdGraph(ORIGIN, 'en-gb') as {
      '@context': string;
      '@graph': Record<string, unknown>[];
    };
    expect(g['@context']).toBe('https://schema.org');
    expect(g['@graph']).toHaveLength(3);

    const logo = g['@graph'].find((n) => n['@type'] === 'ImageObject');
    const org = g['@graph'].find((n) => n['@type'] === 'Organization');
    const site = g['@graph'].find((n) => n['@type'] === 'WebSite');

    expect(logo?.['@id']).toBe(`${ORIGIN}/#logo`);
    expect(org?.['@id']).toBe(`${ORIGIN}/#organization`);
    expect((org as { logo?: { '@id': string } }).logo).toEqual({ '@id': `${ORIGIN}/#logo` });
    expect(site?.['@id']).toBe(`${ORIGIN}/#website`);
    expect((site as { publisher?: { '@id': string } }).publisher).toEqual({ '@id': `${ORIGIN}/#organization` });
    expect((org as { identifier?: { propertyID?: string } }).identifier?.propertyID).toBe('SRA');
    expect(Array.isArray((org as { knowsAbout?: unknown }).knowsAbout)).toBe(true);
  });
});
