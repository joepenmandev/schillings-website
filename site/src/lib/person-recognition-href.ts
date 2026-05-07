import type { PersonRecognition } from '@/data/people';

/**
 * Canonical Schillings listings on major directories (firm-level).
 * Used when `scope === 'firm'` or when a person-scoped badge has no individual URL.
 */
const SCHILLINGS_FIRM_DIRECTORY_HREF: Partial<Record<PersonRecognition['provider'], string>> = {
  chambers: 'https://www.chambersandpartners.com/',
  legal500: 'https://www.legal500.com/firms/2987-schillings/r-england',
  spears: 'https://www.spears500.com/company/20906/schillings',
};

/** Schillings firm listing on each publisher (shared by recognition badges and directory buttons). */
export function schillingsFirmDirectoryHref(
  provider: Exclude<PersonRecognition['provider'], 'other'>,
): string | undefined {
  return SCHILLINGS_FIRM_DIRECTORY_HREF[provider];
}

function firmHrefForProvider(provider: PersonRecognition['provider']): string | undefined {
  return SCHILLINGS_FIRM_DIRECTORY_HREF[provider];
}

/** Legal 500 individual lawyer profile (not the firm overview). */
function isLegal500LawyerProfileUrl(url: string): boolean {
  return /legal500\.com\/[^?#]*\/lawyers\//i.test(url.trim());
}

/**
 * Single outbound URL for a recognition badge: firm scope always uses the firm listing;
 * person scope prefers a sane `href`, and never inherits another lawyer’s Legal 500 profile
 * when the row is marked as a firm recognition.
 */
export function resolveRecognitionOutboundHref(recognition: PersonRecognition): string | undefined {
  const { provider, scope, href } = recognition;
  const raw = href?.trim();

  if (provider === 'other') {
    return raw || undefined;
  }

  const firm = firmHrefForProvider(provider);

  if (scope === 'firm') {
    if (provider === 'legal500' && raw && isLegal500LawyerProfileUrl(raw)) {
      return firm;
    }
    return firm ?? raw;
  }

  // person (default when scope omitted)
  if (raw) {
    return raw;
  }

  return firm;
}
