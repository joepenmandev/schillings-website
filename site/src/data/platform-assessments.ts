export interface PlatformAssessment {
  id: string;
  title: string;
  confidence: 'low' | 'moderate' | 'high';
  assumptions: string[];
  recommendedPriorities: string[];
  analystReviewState: 'available' | 'gated-live-engagement';
  aiProvenance: Array<{ label: string; source: 'deterministic' | 'model-inferred' | 'analyst-reviewed' }>;
  methodologyVersion: string;
}

export const platformAssessments: Record<string, PlatformAssessment> = {
  default: {
    id: 'default',
    title: 'Schillings Intelligence briefing',
    confidence: 'moderate',
    assumptions: ['Inputs are principal-provided and context complete.'],
    recommendedPriorities: [
      'Confirm the principal context before external distribution.',
      'Escalate active matters to analyst review.',
      'Use linked assessments to test adjacent risk vectors.',
    ],
    analystReviewState: 'available',
    aiProvenance: [
      { label: 'Framework structure', source: 'deterministic' },
      { label: 'Narrative synthesis', source: 'model-inferred' },
      { label: 'Escalation quality check', source: 'analyst-reviewed' },
    ],
    methodologyVersion: 'v1.0-draft',
  },
  'executive-exposure-audit': {
    id: 'executive-exposure-audit',
    title: 'Executive Exposure Audit',
    confidence: 'moderate',
    assumptions: ['Public profile coverage reflects current principal footprint.'],
    recommendedPriorities: [
      'Tighten exposed personal-data surfaces in highest-risk categories.',
      'Harden instruction-verification controls for staff and family office.',
      'Escalate severe findings to analyst review for signed observations.',
    ],
    analystReviewState: 'available',
    aiProvenance: [
      { label: 'Exposure category structure', source: 'deterministic' },
      { label: 'Risk narrative synthesis', source: 'model-inferred' },
      { label: 'Priority ordering', source: 'analyst-reviewed' },
    ],
    methodologyVersion: 'v1.0-draft',
  },
  'headline-risk-assessment': {
    id: 'headline-risk-assessment',
    title: 'Headline Risk Assessment',
    confidence: 'moderate',
    assumptions: ['Source artifact is final draft or materially representative.'],
    recommendedPriorities: [
      'Rework highest-risk phrasing before release.',
      'Stress-test interpretation across journalist and regulator lenses.',
      'Escalate sensitive artifacts for analyst review ahead of publication.',
    ],
    analystReviewState: 'available',
    aiProvenance: [
      { label: 'Lens framework', source: 'deterministic' },
      { label: 'Interpretation paragraphs', source: 'model-inferred' },
      { label: 'High-risk escalation checks', source: 'analyst-reviewed' },
    ],
    methodologyVersion: 'v1.0-draft',
  },
  'narrative-warfare-analyzer': {
    id: 'narrative-warfare-analyzer',
    title: 'Narrative Warfare Analyzer',
    confidence: 'moderate',
    assumptions: ['Source narrative reflects the current dominant framing.'],
    recommendedPriorities: [
      'Address top-ranked pressure points before the next publishing window.',
      'Prepare stakeholder-specific response positions for likely escalation vectors.',
      'Escalate high-amplification scenarios to analyst review.',
    ],
    analystReviewState: 'available',
    aiProvenance: [
      { label: 'Escalation pathway framework', source: 'deterministic' },
      { label: 'Headline plausibility synthesis', source: 'model-inferred' },
      { label: 'Priority calibration', source: 'analyst-reviewed' },
    ],
    methodologyVersion: 'v1.0-draft',
  },
  'reputation-crisis-simulator': {
    id: 'reputation-crisis-simulator',
    title: 'Reputation Crisis Simulator',
    confidence: 'moderate',
    assumptions: ['Scenario details are sufficiently specific for 72-hour planning.'],
    recommendedPriorities: [
      'Set first-response ownership for the 0-6h window.',
      'Prepare board and investor briefing lines before escalation peaks.',
      'Activate analyst review where live matters are in scope.',
    ],
    analystReviewState: 'available',
    aiProvenance: [
      { label: 'Timeline window structure', source: 'deterministic' },
      { label: 'Stakeholder reaction synthesis', source: 'model-inferred' },
      { label: 'Intervention sequencing', source: 'analyst-reviewed' },
    ],
    methodologyVersion: 'v1.0-draft',
  },
  'ai-impersonation-exposure-audit': {
    id: 'ai-impersonation-exposure-audit',
    title: 'AI Impersonation Exposure Audit',
    confidence: 'moderate',
    assumptions: ['Public media availability inputs are representative of current exposure.'],
    recommendedPriorities: [
      'Harden instruction verification for executive and family-office channels.',
      'Reduce public media assets that materially increase replication risk.',
      'Escalate high-severity scenarios for analyst-reviewed controls.',
    ],
    analystReviewState: 'available',
    aiProvenance: [
      { label: 'Sub-index structure', source: 'deterministic' },
      { label: 'Scenario plausibility synthesis', source: 'model-inferred' },
      { label: 'Risk-priority sequencing', source: 'analyst-reviewed' },
    ],
    methodologyVersion: 'v1.0-draft',
  },
};
