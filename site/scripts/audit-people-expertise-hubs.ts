/**
 * One-off / refresh: regenerates docs/people/PEOPLE-EXPERTISE-HUB-MEMBERSHIP-AUDIT.md
 * from publishedPeople + resolvePersonPracticeGroup.
 *
 * Run: npm run audit:people-expertise-hubs  (or npx tsx scripts/audit-people-expertise-hubs.ts)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishedPeople } from '../src/data/people';
import type { ExpertiseId, PracticeGroupId } from '../src/data/people-taxonomy';
import { EXPERTISE_IDS, PRACTICE_GROUP_LABELS } from '../src/data/people-taxonomy';
import { resolvePersonPracticeGroup } from '../src/lib/people-directory';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, '..');
const outPath = join(siteRoot, 'docs/people/PEOPLE-EXPERTISE-HUB-MEMBERSHIP-AUDIT.md');

type Row = {
  slug: string;
  name: string;
  role: string;
  importPg: PracticeGroupId | undefined;
  effectivePg: PracticeGroupId;
  expertise: ExpertiseId[];
};

function main() {
  const people = publishedPeople().filter((p) => !p.draft);
  const rows: Row[] = people.map((p) => ({
    slug: p.slug,
    name: p.name,
    role: p.role,
    importPg: p.practiceGroup,
    effectivePg: resolvePersonPracticeGroup(p),
    expertise: p.expertise ?? [],
  }));

  const lines: string[] = [];
  const nl = () => lines.push('');
  const h = (s: string) => lines.push(s);
  const bullet = (s: string) => lines.push(`- ${s}`);

  h('# People expertise hub membership audit');
  lines.push('');
  lines.push(
    `**Generated:** ${new Date().toISOString().slice(0, 10)} (refresh: \`npm run audit:people-expertise-hubs\`)`,
  );
  lines.push('');
  lines.push('**Scope:** Compare `expertise[]` (hub membership via `peopleForExpertise`) with **effective** directory department (`resolvePersonPracticeGroup`: overrides → import `practiceGroup` → inference).');
  lines.push('');
  lines.push(
    '**Audit map:** §1 legal contamination · §2 DR tag/PG alignment · §3 intel tag outliers · §4 comms PG · §5 legal completeness heuristic · §6 corporate/intl + litigation · §7 per-hub counts · §8 tests · §9 review summary · §10 staged decisions.',
  );
  lines.push('');
  lines.push('**Definitions:**');
  bullet('**Import `practiceGroup`** — value stored in `people-imported.json` (explicit department when set).');
  bullet('**Effective practice group** — directory/byline resolution: `people-practice-group-overrides.json` → else `resolvePracticeGroup(role, expertise, import practiceGroup, bio)`.');
  bullet('**Hub membership** — `expertise[]` contains the `ExpertiseId`; see `peopleForExpertise()` in `service-hubs.ts`.');
  nl();

  h('## Operating notes');
  bullet(
    '**Byline & directory** — Import `practiceGroup`, overrides, and inference produce the **effective** practice group on people cards; that is **department ownership** in the directory, separate from expertise-hub rosters.',
  );
  bullet(
    '**Expertise hubs** — Only `expertise[]` determines who appears on `/expertise/{slug}/` pages (`peopleForExpertise`).',
  );
  bullet(
    '**Allowlists** — Use `src/data/people-expertise-hub-allowlists.ts` **only** for **documented** exceptions; default is to correct `people-imported.json` (or overrides).',
  );
  bullet('**Ambiguous cases** — If tags conflict with role or public bio intent, **human review** before editing data.');
  nl();

  // --- 1. Legal hub contamination
  h('## 1. Legal hub (`litigation_disputes`) vs effective practice group');
  const litNonLegal = rows.filter((r) => r.expertise.includes('litigation_disputes') && r.effectivePg !== 'legal');
  if (litNonLegal.length === 0) {
    bullet('_No profiles: everyone with `litigation_disputes` has effective practice group `legal`._');
  } else {
    for (const r of litNonLegal) {
      bullet(
        `**${r.name}** (\`${r.slug}\`) — effective: **${r.effectivePg}** (${PRACTICE_GROUP_LABELS[r.effectivePg]}), import: ${r.importPg ?? '—'}, expertise: \`${r.expertise.join(', ')}\`, role: _${r.role}_`,
      );
    }
  }
  nl();

  // --- 2. Digital Resilience
  h('## 2. Digital Resilience (`digital_resilience`)');
  h('### 2a. Has `digital_resilience` but effective PG is not `dr`');
  const drTagNotDrPg = rows.filter((r) => r.expertise.includes('digital_resilience') && r.effectivePg !== 'dr');
  if (drTagNotDrPg.length === 0) {
    bullet('_None._');
  } else {
    for (const r of drTagNotDrPg) {
      bullet(
        `**${r.name}** (\`${r.slug}\`) — effective **${r.effectivePg}**, import ${r.importPg ?? '—'}, expertise: \`${r.expertise.join(', ')}\` — _may be intentional ISD/legal + DR tooling; allowlist in tests if confirmed._`,
      );
    }
  }
  nl();
  h('### 2b. Import `practiceGroup` is `dr` but missing `digital_resilience`');
  const importDrNoTag = rows.filter((r) => r.importPg === 'dr' && !r.expertise.includes('digital_resilience'));
  if (importDrNoTag.length === 0) {
    bullet('_None._');
  } else {
    for (const r of importDrNoTag) {
      bullet(`**${r.name}** (\`${r.slug}\`) — expertise: \`${r.expertise.join(', ')}\``);
    }
  }
  nl();
  h('### 2c. Effective PG is `dr` but missing `digital_resilience` (includes override-only `dr`)');
  const effectiveDrNoTag = rows.filter((r) => r.effectivePg === 'dr' && !r.expertise.includes('digital_resilience'));
  if (effectiveDrNoTag.length === 0) {
    bullet('_None._');
  } else {
    for (const r of effectiveDrNoTag) {
      bullet(
        `**${r.name}** (\`${r.slug}\`) — import ${r.importPg ?? '—'}, expertise: \`${r.expertise.join(', ')}\` — _add \`digital_resilience\` or allowlist._`,
      );
    }
  }
  nl();

  // --- 3. Intelligence_security vs PG
  h('## 3. `intelligence_security` vs effective practice group (flag only)');
  const intelPg = rows.filter((r) => r.expertise.includes('intelligence_security'));
  const intelOdd = intelPg.filter((r) => r.effectivePg !== 'isd' && r.effectivePg !== 'dr');
  bullet(`Total with \`intelligence_security\`: **${intelPg.length}**`);
  bullet(`Effective PG is neither \`isd\` nor \`dr\`: **${intelOdd.length}** (legal / scom lawyers or comms with intel tags — often intentional).`);
  nl();
  if (intelOdd.length) {
    h('### Profiles (effective legal or scom with `intelligence_security`)');
    for (const r of intelOdd.sort((a, b) => a.slug.localeCompare(b.slug))) {
      bullet(`**${r.name}** (\`${r.slug}\`) — **${r.effectivePg}**, import ${r.importPg ?? '—'}, expertise: \`${r.expertise.join(', ')}\``);
    }
    nl();
  }

  // --- 4. Communications
  h('## 4. `communications` vs effective practice group (flag only)');
  const comm = rows.filter((r) => r.expertise.includes('communications'));
  const allowedComm = new Set<PracticeGroupId>(['scom', 'dr', 'isd', 'legal']);
  const commOdd = comm.filter((r) => !allowedComm.has(r.effectivePg));
  bullet(`Total with \`communications\`: **${comm.length}**`);
  bullet(`Effective PG not in {scom, dr, isd, legal}: **${commOdd.length}**`);
  if (commOdd.length) {
    for (const r of commOdd) {
      bullet(`**${r.name}** (\`${r.slug}\`) — effective **${r.effectivePg}**`);
    }
  }
  nl();

  // --- 5. Legal completeness (heuristic)
  h('## 5. Legal completeness (heuristic — needs human review)');
  const legalNoLit = rows.filter(
    (r) => r.effectivePg === 'legal' && r.expertise.includes('reputation_privacy') && !r.expertise.includes('litigation_disputes'),
  );
  bullet(
    `Effective **legal** with \`reputation_privacy\` but **no** \`litigation_disputes\`: **${legalNoLit.length}** — consider adding the tag if they should appear on the Legal Protection & Disputes hub.`,
  );
  for (const r of legalNoLit.sort((a, b) => a.slug.localeCompare(b.slug))) {
    bullet(`**${r.name}** (\`${r.slug}\`) — expertise: \`${r.expertise.join(', ')}\`, role: _${r.role}_`);
  }
  nl();

  // --- 6. Corporate / international + litigation
  h('## 6. Corporate / international emphasis + `litigation_disputes` (review)');
  const corpIntlSlugs = rows.filter(
    (r) =>
      r.expertise.includes('litigation_disputes') &&
      !r.expertise.includes('reputation_privacy') &&
      (r.expertise.includes('corporate_transactions') || r.expertise.includes('international')),
  );
  for (const r of corpIntlSlugs.sort((a, b) => a.slug.localeCompare(b.slug))) {
    bullet(`**${r.name}** (\`${r.slug}\`) — effective **${r.effectivePg}**, expertise: \`${r.expertise.join(', ')}\``);
  }
  if (corpIntlSlugs.length === 0) bullet('_None matching heuristic._');
  nl();

  // --- 7. Per-hub distribution
  h('## 7. Hub membership by `ExpertiseId`');
  for (const eid of EXPERTISE_IDS) {
    const members = rows.filter((r) => r.expertise.includes(eid));
    const dist = new Map<PracticeGroupId, number>();
    for (const r of members) {
      dist.set(r.effectivePg, (dist.get(r.effectivePg) ?? 0) + 1);
    }
    const distStr = [...dist.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
    h(`### \`${eid}\` — **${members.length}** people`);
    bullet(`Effective PG distribution: ${distStr || '—'}`);
    bullet(`Slugs: ${members.map((m) => m.slug).sort().join(', ')}`);
    nl();
  }

  h('## 8. Regression tests');
  bullet('See `src/data/people-expertise-hub-membership.test.ts` — allowlists in `src/data/people-expertise-hub-allowlists.ts`.');
  nl();

  h('## 9. Needs human review (summary)');
  bullet('Any row in §2a / §6 / unusual §7 outliers.');
  bullet('§5 list: reputation-facing profiles **without** `litigation_disputes` — consider hub intent case-by-case (see §10 for resolved examples).');
  nl();

  h('## 10. Staged review decisions');
  bullet(
    '**David Imison** (`david-imison`) — **No data change.** Public bio emphasises CEO leadership, strategic growth, and reputation / high-stakes client work (e.g. Spear’s reputation index); it does **not** position front-line **Legal Protection & Disputes** delivery. Keeping **`litigation_disputes` absent** is appropriate.',
  );
  bullet(
    '**Mark Tibbs** (`mark-tibbs`) — **No data change.** Bio describes multi-jurisdictional **disputes**, supporting matters through **legal proceedings**, and Partner-level investigations leadership at a city law firm; **`litigation_disputes` retained** as intentional.',
  );
  nl();

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log('Wrote', outPath);
}

main();
