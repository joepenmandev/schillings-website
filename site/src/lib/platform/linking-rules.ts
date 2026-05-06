export interface LinkedInsight {
  targetId: string;
  label: string;
  reason: string;
}

const RULES: Record<string, LinkedInsight[]> = {
  'executive-exposure-audit': [
    {
      targetId: 'ai-impersonation-exposure-audit',
      label: 'AI Impersonation Exposure Audit',
      reason: 'High-exposure signals often increase synthetic-media misuse risk.',
    },
    {
      targetId: 'headline-risk-assessment',
      label: 'Headline Risk Assessment',
      reason: 'Exposure posture should be tested against narrative interpretation risk.',
    },
  ],
  'headline-risk-assessment': [
    {
      targetId: 'narrative-warfare-analyzer',
      label: 'Narrative Warfare Analyzer',
      reason: 'Interpretation findings should be tested for 7-30 day escalation pathways.',
    },
    {
      targetId: 'reputation-crisis-simulator',
      label: 'Reputation Crisis Simulator',
      reason: 'High-tension outputs require first-72-hours planning discipline.',
    },
  ],
  'narrative-warfare-analyzer': [
    {
      targetId: 'reputation-crisis-simulator',
      label: 'Reputation Crisis Simulator',
      reason: 'Escalation vectors should be tested against first-72-hours crisis posture.',
    },
    {
      targetId: 'executive-exposure-audit',
      label: 'Executive Exposure Audit',
      reason: 'Narrative trajectories should be contextualized against exposure baseline.',
    },
  ],
  'reputation-crisis-simulator': [
    {
      targetId: 'headline-risk-assessment',
      label: 'Headline Risk Assessment',
      reason: 'Crisis response drafts should be assessed for interpretation risk before release.',
    },
    {
      targetId: 'narrative-warfare-analyzer',
      label: 'Narrative Warfare Analyzer',
      reason: 'Crisis scenarios should be linked to downstream narrative escalation pathways.',
    },
  ],
  'ai-impersonation-exposure-audit': [
    {
      targetId: 'executive-exposure-audit',
      label: 'Executive Exposure Audit',
      reason: 'Impersonation risk should be measured alongside broader principal exposure.',
    },
    {
      targetId: 'reputation-crisis-simulator',
      label: 'Reputation Crisis Simulator',
      reason: 'High-misuse scenarios require deterministic first-response planning.',
    },
  ],
};

export function linkedInsightsFor(assessmentId: string): LinkedInsight[] {
  return RULES[assessmentId] ?? [];
}
