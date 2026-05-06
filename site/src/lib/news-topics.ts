import type { ExpertiseId } from '../data/people-taxonomy';
import { EXPERTISE_IDS, EXPERTISE_LABELS } from '../data/people-taxonomy';

/** Themes for News & Insights — links to service hubs (IA-aligned internal discovery). */
export type NewsThemeLink = {
  expertiseId: ExpertiseId;
  label: string;
};

export const NEWS_THEME_LINKS: NewsThemeLink[] = EXPERTISE_IDS.map((expertiseId) => ({
  expertiseId,
  label: EXPERTISE_LABELS[expertiseId],
}));
