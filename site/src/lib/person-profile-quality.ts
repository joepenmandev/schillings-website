import type { PersonProfile } from '../data/people';

/** Bios shorter than this are treated as thin: noindex and without the extra strategic link sections. */
export const THIN_PERSON_BIO_MAX_CHARS = 300;

export function isThinPersonProfile(person: Pick<PersonProfile, 'paragraphs'>): boolean {
  const text = person.paragraphs.join(' ').trim();
  return text.length < THIN_PERSON_BIO_MAX_CHARS;
}
