import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const docsRoot = fileURLToPath(new URL('../../docs/EXECUTIVE-INTELLIGENCE-PLATFORM', import.meta.url));

export function loadPlatformDoc(relativePath: string): string {
  return readFileSync(`${docsRoot}/${relativePath}`, 'utf8');
}

export const platformMethodologies = [
  {
    id: 'executive-exposure-index',
    title: 'Executive Exposure Index',
    description: 'Methodology v1.0',
    docPath: 'methodology/executive-exposure-index-v1.md',
  },
  {
    id: 'public-interpretation-analysis',
    title: 'Public Interpretation Analysis',
    description: 'Methodology v1.0',
    docPath: 'methodology/public-interpretation-analysis-v1.md',
  },
  {
    id: 'narrative-escalation-map',
    title: 'Narrative Escalation Map',
    description: 'Methodology v1.0',
    docPath: 'methodology/narrative-escalation-map-v1.md',
  },
  {
    id: 'crisis-escalation-forecast',
    title: 'Crisis Escalation Forecast',
    description: 'Methodology v1.0',
    docPath: 'methodology/crisis-escalation-forecast-v1.md',
  },
  {
    id: 'executive-ai-misuse-risk',
    title: 'Executive AI Misuse Risk',
    description: 'Methodology v1.0',
    docPath: 'methodology/executive-ai-misuse-risk-v1.md',
  },
] as const;

export const platformDecisionDefaults = [
  'Platform remains on the main-site path while sponsor sign-off is pending.',
  'UK, US, and Ireland remain day-1 market scope.',
  'Free top-line and gated full report split remains in draft posture.',
  'Third-party personalized profiling remains consent-gated and refusal-enforced.',
] as const;

export const platformTools = [
  {
    id: 'executive-exposure-audit',
    title: 'Executive Exposure Audit',
    description: 'Exposure Intelligence assessment',
    docPath: 'page-copy/tools/executive-exposure-audit.md',
    fieldLabel: 'Principal profile context',
    fieldPlaceholder: 'Role, region, and primary exposure concern',
    refusalLimits: [
      'This assessment does not profile non-consenting third parties.',
      'This assessment does not process minors as subjects.',
      'This assessment does not provide legal advice.',
    ],
  },
  {
    id: 'headline-risk-assessment',
    title: 'Headline Risk Assessment',
    description: 'Narrative Intelligence assessment',
    docPath: 'page-copy/tools/headline-risk-assessment.md',
    fieldLabel: 'Draft communication',
    fieldPlaceholder: 'Paste the draft statement, memo, or message for assessment',
    refusalLimits: [
      'This assessment does not generate hostile messaging.',
      'This assessment does not evaluate pejorative targeting of named individuals.',
      'This assessment does not provide legal advice.',
    ],
  },
  {
    id: 'narrative-warfare-analyzer',
    title: 'Narrative Warfare Analyzer',
    description: 'Narrative Intelligence assessment',
    docPath: 'page-copy/tools/narrative-warfare-analyzer.md',
    fieldLabel: 'Source narrative',
    fieldPlaceholder: 'Paste an article excerpt, thread, or transcript for escalation mapping',
    refusalLimits: [
      'This assessment uses adversary archetypes only and does not name individuals as adversaries.',
      'This assessment does not generate hostile amplification guidance.',
      'This assessment does not provide legal advice.',
    ],
  },
  {
    id: 'reputation-crisis-simulator',
    title: 'Reputation Crisis Simulator',
    description: 'Crisis Intelligence assessment',
    docPath: 'page-copy/tools/reputation-crisis-simulator.md',
    fieldLabel: 'Scenario description',
    fieldPlaceholder: 'Describe the incident or board-level concern to simulate',
    refusalLimits: [
      'This assessment does not target named individuals with assertions of wrongdoing.',
      'This assessment does not support retaliatory strategy.',
      'This assessment does not provide legal advice.',
    ],
  },
  {
    id: 'ai-impersonation-exposure-audit',
    title: 'AI Impersonation Exposure Audit',
    description: 'Exposure Intelligence assessment',
    docPath: 'page-copy/tools/ai-impersonation-exposure-audit.md',
    fieldLabel: 'Impersonation exposure context',
    fieldPlaceholder: 'Summarize public media footprint and known instruction channels',
    refusalLimits: [
      'This assessment does not create synthetic media.',
      'This assessment does not profile non-consenting third parties.',
      'This assessment does not provide legal advice.',
    ],
  },
] as const;
