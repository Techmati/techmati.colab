import { NahuatlVariant } from './nahuatl-variant.type';
import { ContributorSummary } from './contributor.type';
import { TranslationEntry } from './translation-entry.type';
import { PhraseSet } from './phrase-set.type';

export interface Translation {
  id: string;
  contributorId: string;
  phraseSetId: string;
  dialect: NahuatlVariant | null;
  attemptedAt: string;
  contributedEntriesCount: number;
  progressPercentage: number;
  inProgress: boolean;
  completed: boolean;
  lastUpdate: string | null;
  phraseCount: number;
  phraseSet?: PhraseSet | null;
  entries?: TranslationEntry[];
}

export interface AdminTranslationListItem extends Translation {
  contributor: ContributorSummary | null;
}

export type TranslationFilter = 'all' | 'in_progress' | 'completed';
