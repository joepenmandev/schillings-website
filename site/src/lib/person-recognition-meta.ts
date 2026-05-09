import type { PersonRecognition } from '@/data/people';

const providerOrder: Record<PersonRecognition['provider'], number> = {
  chambers: 0,
  legal500: 1,
  spears: 2,
  other: 3,
};

export function recognitionProviderLabel(provider: PersonRecognition['provider']): string {
  if (provider === 'legal500') return 'The Legal 500';
  if (provider === 'spears') return "Spear's";
  if (provider === 'chambers') return 'Chambers and Partners';
  return 'Independent source';
}

/** Publisher + year, for strip metadata lines (matches badge subtitle semantics). */
export function recognitionDirectoryLine(item: PersonRecognition): string {
  return [recognitionProviderLabel(item.provider), item.year].filter(Boolean).join(' ');
}

/** Same ordering as trust badges: person-scoped first, then provider tier, then year desc. */
export function sortPersonRecognitions(recognitions: readonly PersonRecognition[]): PersonRecognition[] {
  return [...recognitions].sort((a, b) => {
    const aScope = a.scope === 'person' ? 0 : 1;
    const bScope = b.scope === 'person' ? 0 : 1;
    if (aScope !== bScope) return aScope - bScope;
    const aProvider = providerOrder[a.provider] ?? 99;
    const bProvider = providerOrder[b.provider] ?? 99;
    if (aProvider !== bProvider) return aProvider - bProvider;
    const aYear = Number.parseInt(a.year ?? '0', 10) || 0;
    const bYear = Number.parseInt(b.year ?? '0', 10) || 0;
    return bYear - aYear;
  });
}
