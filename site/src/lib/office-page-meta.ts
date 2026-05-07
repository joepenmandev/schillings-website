import type { Office } from './offices';

/**
 * Meta description for `/london/`, `/miami/`, `/dublin/` — local + practice intent without changing page H1 or layout.
 */
export function officeContactPageDescription(office: Office): string {
  return `Schillings ${office.cityLabel} — lawyers and advisers for reputation, privacy, disputes, and investigations. Address, map, phone, email, and regional enquiry form.`;
}
