import { describe, expect, it } from 'vitest';
import importedRaw from './people-imported.json';
import { SENIORITY_IDS } from './people-taxonomy';

type ImportedRow = { slug: string; role: string; seniority: string };

const rows = importedRaw as ImportedRow[];

/** Catches pasted titles run together (e.g. `DirectorSenior Associate…`). */
const mergedWordTypo = /[a-z][A-Z]/;

describe('people-imported.json', () => {
  it('has no role strings with merged words (lowercase letter immediately before uppercase)', () => {
    const bad = rows.filter((p) => mergedWordTypo.test(p.role ?? ''));
    expect(
      bad,
      bad.length ? `${bad.map((p) => `${p.slug}: ${p.role}`).join('; ')}` : '',
    ).toEqual([]);
  });

  it('uses only seniority values that the app recognises', () => {
    const allowed = new Set<string>(SENIORITY_IDS);
    /** Normalised from legacy imports in `normalizeImportedSeniority`. */
    allowed.add('counsel');
    const bad = rows.filter((p) => !allowed.has(p.seniority));
    expect(
      bad,
      bad.length ? bad.map((p) => `${p.slug}: ${p.seniority}`).join('; ') : '',
    ).toEqual([]);
  });
});
