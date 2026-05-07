import type { ExpertiseId } from '../data/people-taxonomy';
import hubRaw from '../data/service-hub-content.json';
import { clipPlainText } from './person-jsonld';

export type ServiceHubBlock = {
  intro: string;
  bullets?: string[];
  legalNote: string;
  /** Optional SERP-focused description; partnership/comms should approve wording. */
  serpDescription?: string;
  /** Firmwide practice positioning vs scenarios or editorial (Phase 2B). */
  authorityFraming?: string;
  /** Optional lead-in before the standard confidential CTA sentence (Phase 2B). */
  ctaContext?: string;
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

/** Document `<title>` — commercial clarity; H1 remains the public expertise label on-page. */
export function expertiseHubDocumentTitle(publicLabel: string): string {
  return `${publicLabel} | Legal expertise | Schillings`;
}

export function expertiseHubMetaDescription(id: ExpertiseId, publicLabel: string): string {
  const c = getServiceHubCopy(id);
  const serp = c.serpDescription?.trim();
  if (serp) return clipPlainText(serp, 158);
  return clipPlainText(`${publicLabel}: ${c.intro}`, 158);
}
