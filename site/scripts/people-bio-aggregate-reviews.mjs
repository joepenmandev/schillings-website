#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const RESULTS_DIR = path.resolve(
  process.cwd(),
  'site/docs/people-bio-references/automated-validation/results'
);

const REQUIRED_LENSES = ['GC/legal-risk', 'adviser/intermediary', 'operator/executive'];
const REQUIRED_FIELDS = [
  'profile_slug',
  'profile_url',
  'viewport',
  'reviewer_lens',
  'section_scores',
  'total_score',
  'confidence_verdict',
  'dominant_trust_mode',
  'referral_safety',
  'friction_markers',
  'repeated_issue_candidates',
  'notes_short',
  'review_timestamp',
  'source_basis',
];

const ALLOWED_VIEWPORT = new Set(['desktop', 'mobile']);
const ALLOWED_LENS = new Set(['GC/legal-risk', 'adviser/intermediary', 'operator/executive', 'journalist/UHNW']);
const ALLOWED_CONFIDENCE = new Set(['Strong', 'Mixed', 'Weak']);
const ALLOWED_TRUST_MODE = new Set(['Institutional', 'Relational', 'Mixed', 'Unclear']);
const ALLOWED_REFERRAL = new Set(['Yes', 'Maybe', 'No']);
const ALLOWED_SOURCE_BASIS = new Set(['rendered_profile', 'live_url', 'supplied_html', 'supplied_pdf']);

function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return (sorted[mid - 1] + sorted[mid]) / 2;
  return sorted[mid];
}

function mean(values) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function range(values) {
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { min, max, delta: max - min };
}

function incrementCount(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function validateReview(review, fileName) {
  for (const field of REQUIRED_FIELDS) {
    if (!(field in review)) {
      throw new Error(`${fileName}: missing required field "${field}"`);
    }
  }

  if (!ALLOWED_VIEWPORT.has(review.viewport)) {
    throw new Error(`${fileName}: invalid viewport "${review.viewport}"`);
  }
  if (!ALLOWED_LENS.has(review.reviewer_lens)) {
    throw new Error(`${fileName}: invalid reviewer_lens "${review.reviewer_lens}"`);
  }
  if (!Number.isInteger(review.total_score) || review.total_score < 0 || review.total_score > 20) {
    throw new Error(`${fileName}: invalid total_score "${review.total_score}"`);
  }
  if (!ALLOWED_CONFIDENCE.has(review.confidence_verdict)) {
    throw new Error(`${fileName}: invalid confidence_verdict "${review.confidence_verdict}"`);
  }
  if (!ALLOWED_TRUST_MODE.has(review.dominant_trust_mode)) {
    throw new Error(`${fileName}: invalid dominant_trust_mode "${review.dominant_trust_mode}"`);
  }
  if (!ALLOWED_REFERRAL.has(review.referral_safety)) {
    throw new Error(`${fileName}: invalid referral_safety "${review.referral_safety}"`);
  }
  if (!ALLOWED_SOURCE_BASIS.has(review.source_basis)) {
    throw new Error(`${fileName}: invalid source_basis "${review.source_basis}"`);
  }
  if (!Array.isArray(review.friction_markers)) {
    throw new Error(`${fileName}: friction_markers must be an array`);
  }
  if (!Array.isArray(review.repeated_issue_candidates)) {
    throw new Error(`${fileName}: repeated_issue_candidates must be an array`);
  }
}

function formatNumber(value) {
  if (value === null || Number.isNaN(value)) return 'n/a';
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2);
}

function buildMarkdown(aggregation) {
  const lines = [];
  lines.push('# Cohort 1 Automated Aggregation');
  lines.push('');
  lines.push(`- Reviews processed: ${aggregation.reviewCount}`);
  lines.push(`- Profiles covered: ${aggregation.profileCount}`);
  lines.push('');
  lines.push('## Profiles Reviewed');
  lines.push('');
  for (const slug of aggregation.profiles) {
    lines.push(`- ${slug}`);
  }
  lines.push('');
  lines.push('## Review Coverage');
  lines.push('');
  lines.push(`- Expected lenses per profile (minimum): ${REQUIRED_LENSES.join(', ')}`);
  lines.push(`- Desktop reviews: ${aggregation.viewportCounts.desktop}`);
  lines.push(`- Mobile reviews: ${aggregation.viewportCounts.mobile}`);
  lines.push('');
  lines.push('## Mean Score by Profile');
  lines.push('');
  for (const [slug, scores] of aggregation.profileScores.entries()) {
    lines.push(`- ${slug}: ${formatNumber(mean(scores))}`);
  }
  lines.push('');
  lines.push('## Median Score by Profile');
  lines.push('');
  for (const [slug, scores] of aggregation.profileScores.entries()) {
    lines.push(`- ${slug}: ${formatNumber(median(scores))}`);
  }
  lines.push('');
  lines.push('## Desktop vs Mobile Score Difference');
  lines.push('');
  for (const [slug, scoreSet] of aggregation.profileViewportScores.entries()) {
    const desktop = mean(scoreSet.desktop);
    const mobile = mean(scoreSet.mobile);
    const diff = desktop !== null && mobile !== null ? mobile - desktop : null;
    lines.push(`- ${slug}: desktop ${formatNumber(desktop)}, mobile ${formatNumber(mobile)}, delta ${formatNumber(diff)}`);
  }
  lines.push('');
  lines.push('## Referral Safety Summary');
  lines.push('');
  for (const key of ['Yes', 'Maybe', 'No']) {
    lines.push(`- ${key}: ${aggregation.referralSafetyCounts.get(key) ?? 0}`);
  }
  lines.push('');
  lines.push('## Dominant Trust Mode Distribution');
  lines.push('');
  for (const key of ['Institutional', 'Relational', 'Mixed', 'Unclear']) {
    lines.push(`- ${key}: ${aggregation.trustModeCounts.get(key) ?? 0}`);
  }
  lines.push('');
  lines.push('## Recurring Friction Markers');
  lines.push('');
  for (const [marker, count] of aggregation.topFrictionMarkers) {
    lines.push(`- ${marker}: ${count}`);
  }
  if (aggregation.topFrictionMarkers.length === 0) lines.push('- none');
  lines.push('');
  lines.push('## Repeated Issue Candidates');
  lines.push('');
  for (const [issue, count] of aggregation.topRepeatedIssues) {
    lines.push(`- ${issue}: ${count}`);
  }
  if (aggregation.topRepeatedIssues.length === 0) lines.push('- none');
  lines.push('');
  lines.push('## D-002 Trigger Check');
  lines.push('');
  lines.push(`- same confidence friction in >=2 profiles and >=2 reviewers: ${aggregation.d002.crossProfileCrossReviewer ? 'Yes' : 'No'}`);
  lines.push(`- recurring mobile trust formation delay: ${aggregation.d002.mobileTrustDelay ? 'Yes' : 'No'}`);
  lines.push(`- recurring proof discoverability friction: ${aggregation.d002.proofDiscoverability ? 'Yes' : 'No'}`);
  lines.push(`- recurring rhetoric inflation after updates: ${aggregation.d002.rhetoricInflation ? 'Yes' : 'No'}`);
  lines.push(`- measurable variance increase after change cycle: ${aggregation.d002.varianceIncrease}`);
  lines.push(`- escalation evidence minimum present: ${aggregation.d002.evidenceMinimum}`);
  lines.push('');
  lines.push('## Stop/Go Recommendation');
  lines.push('');
  lines.push('- Continue stabilization');
  lines.push('- Proceed to Cohort 2');
  lines.push('- Open narrow Phase 2 investigation');
  lines.push('- Pause rollout');
  lines.push('');
  lines.push('## Notes (Structured Only)');
  lines.push('');
  lines.push('- Recommendation must be selected by reviewer/governance owner using runbook thresholds.');
  return `${lines.join('\n')}\n`;
}

async function main() {
  const files = await readdir(RESULTS_DIR);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  const profileScores = new Map();
  const profileViewportScores = new Map();
  const viewportCounts = { desktop: 0, mobile: 0 };
  const referralSafetyCounts = new Map();
  const trustModeCounts = new Map();
  const frictionMarkerCounts = new Map();
  const repeatedIssueCounts = new Map();
  const markerProfiles = new Map();
  const markerReviewers = new Map();
  const profiles = new Set();

  for (const fileName of jsonFiles) {
    const filePath = path.join(RESULTS_DIR, fileName);
    const raw = await readFile(filePath, 'utf8');
    const review = JSON.parse(raw);
    validateReview(review, fileName);

    profiles.add(review.profile_slug);
    viewportCounts[review.viewport] += 1;
    incrementCount(referralSafetyCounts, review.referral_safety);
    incrementCount(trustModeCounts, review.dominant_trust_mode);

    if (!profileScores.has(review.profile_slug)) profileScores.set(review.profile_slug, []);
    profileScores.get(review.profile_slug).push(review.total_score);

    if (!profileViewportScores.has(review.profile_slug)) {
      profileViewportScores.set(review.profile_slug, { desktop: [], mobile: [] });
    }
    profileViewportScores.get(review.profile_slug)[review.viewport].push(review.total_score);

    for (const marker of review.friction_markers) {
      incrementCount(frictionMarkerCounts, marker);
      if (!markerProfiles.has(marker)) markerProfiles.set(marker, new Set());
      if (!markerReviewers.has(marker)) markerReviewers.set(marker, new Set());
      markerProfiles.get(marker).add(review.profile_slug);
      markerReviewers.get(marker).add(`${review.profile_slug}:${review.reviewer_lens}`);
    }

    for (const issue of review.repeated_issue_candidates) {
      incrementCount(repeatedIssueCounts, issue);
    }
  }

  const allScores = [...profileScores.values()].flat();
  const varianceRange = range(allScores);
  const topFrictionMarkers = [...frictionMarkerCounts.entries()].sort((a, b) => b[1] - a[1]);
  const topRepeatedIssues = [...repeatedIssueCounts.entries()].sort((a, b) => b[1] - a[1]);

  const crossProfileCrossReviewer = [...frictionMarkerCounts.keys()].some((marker) => {
    const pCount = markerProfiles.get(marker)?.size ?? 0;
    const rCount = markerReviewers.get(marker)?.size ?? 0;
    return pCount >= 2 && rCount >= 2;
  });
  const mobileTrustDelay = [...frictionMarkerCounts.keys()].some((marker) =>
    marker.toLowerCase().includes('mobile trust') || marker.toLowerCase().includes('trust delay')
  );
  const proofDiscoverability = [...frictionMarkerCounts.keys()].some((marker) =>
    marker.toLowerCase().includes('proof discoverability') || marker.toLowerCase().includes('proof adjacency')
  );
  const rhetoricInflation = [...frictionMarkerCounts.keys()].some((marker) =>
    marker.toLowerCase().includes('rhetoric inflation') || marker.toLowerCase().includes('promotional')
  );

  const aggregation = {
    reviewCount: jsonFiles.length,
    profileCount: profiles.size,
    profiles: [...profiles].sort(),
    viewportCounts,
    profileScores,
    profileViewportScores,
    referralSafetyCounts,
    trustModeCounts,
    topFrictionMarkers,
    topRepeatedIssues,
    d002: {
      crossProfileCrossReviewer,
      mobileTrustDelay,
      proofDiscoverability,
      rhetoricInflation,
      varianceIncrease: 'Requires baseline/previous-cycle comparator',
      evidenceMinimum: jsonFiles.length > 0 ? 'Partial (requires rubric deltas + cohort summary)' : 'No',
    },
    varianceRange,
  };

  const report = buildMarkdown(aggregation);
  process.stdout.write(report);
}

main().catch((error) => {
  console.error(`Aggregation failed: ${error.message}`);
  process.exitCode = 1;
});
