/**
 * Resolve a stored image path or absolute URL to a full URL for Open Graph and JSON-LD.
 */
export function absoluteOgImageUrl(origin: string, raw?: string | null): string | undefined {
  const trimmed = raw?.trim();
  if (!trimmed) return undefined;
  const base = origin.replace(/\/$/, '');
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}
