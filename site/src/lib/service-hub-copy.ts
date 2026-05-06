import type { ExpertiseId } from '../data/people-taxonomy';
import hubRaw from '../data/service-hub-content.json';

export type ServiceHubBlock = {
  intro: string;
  bullets?: string[];
  legalNote: string;
};

const hub = hubRaw as Record<string, ServiceHubBlock>;

export function getServiceHubCopy(id: ExpertiseId): ServiceHubBlock {
  return (
    hub[id] ?? {
      intro: 'Practice hub — replace this copy with partnership- and compliance-approved narrative.',
      legalNote:
        'Migration scaffold — not legal advice. Partnership and compliance must approve final expertise descriptions before go-live.',
    }
  );
}
