export interface PlatformScenario {
  id: string;
  title: string;
  pillar: 'Exposure' | 'Narrative' | 'Crisis';
  summary: string;
}

export const platformScenarios: PlatformScenario[] = [
  {
    id: 'activist-coalition',
    title: 'The Activist Coalition',
    pillar: 'Narrative',
    summary: 'Models coordinated framing pressure and 7-day escalation paths.',
  },
  {
    id: 'synthetic-cfo-call',
    title: 'The Synthetic CFO Call',
    pillar: 'Exposure',
    summary: 'Tests impersonation controls against synthetic executive instructions.',
  },
  {
    id: 'investigative-right-to-reply',
    title: 'The Investigative Right-to-Reply',
    pillar: 'Crisis',
    summary: 'Simulates publication windows and first-response priorities for 72 hours.',
  },
];
