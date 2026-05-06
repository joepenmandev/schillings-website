export interface PlatformMethodology {
  id: string;
  title: string;
  version: string;
  reviewerStatus: string;
  changelog: Array<{ version: string; note: string }>;
}

export const platformMethodologies: PlatformMethodology[] = [
  {
    id: 'executive-exposure-index',
    title: 'Executive Exposure Index',
    version: '1.0-draft',
    reviewerStatus: 'Peer review pending',
    changelog: [{ version: '1.0-draft', note: 'Initial methodology draft published.' }],
  },
  {
    id: 'public-interpretation-analysis',
    title: 'Public Interpretation Analysis',
    version: '1.0-draft',
    reviewerStatus: 'Peer review pending',
    changelog: [{ version: '1.0-draft', note: 'Initial methodology draft published.' }],
  },
  {
    id: 'narrative-escalation-map',
    title: 'Narrative Escalation Map',
    version: '1.0-draft',
    reviewerStatus: 'Peer review pending',
    changelog: [{ version: '1.0-draft', note: 'Initial methodology draft published.' }],
  },
  {
    id: 'crisis-escalation-forecast',
    title: 'Crisis Escalation Forecast',
    version: '1.0-draft',
    reviewerStatus: 'Peer review pending',
    changelog: [{ version: '1.0-draft', note: 'Initial methodology draft published.' }],
  },
  {
    id: 'executive-ai-misuse-risk',
    title: 'Executive AI Misuse Risk',
    version: '1.0-draft',
    reviewerStatus: 'Peer review pending',
    changelog: [{ version: '1.0-draft', note: 'Initial methodology draft published.' }],
  },
];
