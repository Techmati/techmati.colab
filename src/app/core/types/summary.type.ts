import { PhraseSet } from './phrase-set.type';

export interface Summary {
  contributorId: string;
  phraseSetId: string;
  contributedEntriesCount: number;
  progressPercentage: number;
  lastUpdate: string;
  inProgress: boolean;
  completed: boolean;
}

export type FullSummary = Summary & { phraseSet: PhraseSet };

export type SummaryFilter = 'all' | 'in_progress' | 'completed';
