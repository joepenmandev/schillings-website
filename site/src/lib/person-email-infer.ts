/**
 * Public `@schillingspartners.com` addresses on bios typically follow `firstname.lastname@…`
 * from the URL slug (`first-last`). This matches the live site pattern for mailto links.
 * Override with explicit `email` on the profile when the pattern does not apply.
 */
export function inferSchillingsEmailFromSlug(slug: string): string | null {
  const parts = slug.split('-').filter(Boolean);
  if (parts.length < 2) return null;
  const local = `${parts[0]}.${parts.slice(1).join('.')}`.toLowerCase();
  return `${local}@schillingspartners.com`;
}
