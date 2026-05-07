import { describe, expect, it } from 'vitest';
import type { PersonRecognition } from '@/data/people';
import { resolveRecognitionOutboundHref } from './person-recognition-href';

describe('resolveRecognitionOutboundHref', () => {
  it('firm scope always uses Schillings firm Legal 500 URL even if href is another lawyer', () => {
    const r: PersonRecognition = {
      provider: 'legal500',
      title: 'Firm profile listed',
      year: '2026',
      scope: 'firm',
      href: 'https://www.legal500.com/firms/2987-schillings/r-england/lawyers/841606-jenny-afia',
    };
    expect(resolveRecognitionOutboundHref(r)).toBe(
      'https://www.legal500.com/firms/2987-schillings/r-england',
    );
  });

  it('person scope keeps individual Legal 500 profile URL', () => {
    const r: PersonRecognition = {
      provider: 'legal500',
      title: 'Hall of Fame listing',
      year: '2026',
      scope: 'person',
      href: 'https://www.legal500.com/firms/2987-schillings/r-england/lawyers/841606-jenny-afia',
    };
    expect(resolveRecognitionOutboundHref(r)).toBe(
      'https://www.legal500.com/firms/2987-schillings/r-england/lawyers/841606-jenny-afia',
    );
  });

  it('person scope without href falls back to firm directory URL', () => {
    const r: PersonRecognition = {
      provider: 'chambers',
      title: 'Band ranked',
      year: '2026',
      scope: 'person',
    };
    expect(resolveRecognitionOutboundHref(r)).toBe('https://www.chambersandpartners.com/');
  });

  it('firm scope uses firm Spear’s URL', () => {
    const r: PersonRecognition = {
      provider: 'spears',
      title: 'Listed',
      year: '2026',
      scope: 'firm',
    };
    expect(resolveRecognitionOutboundHref(r)).toBe('https://www.spears500.com/company/20906/schillings');
  });

  it('other provider passes through href only', () => {
    expect(
      resolveRecognitionOutboundHref({
        provider: 'other',
        title: 'Award',
        href: 'https://example.com/a',
      }),
    ).toBe('https://example.com/a');
  });
});
