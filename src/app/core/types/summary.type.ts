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

export type PhraseSetSummary = Summary & { phraseSet: PhraseSet };
export type EmptySummary = Omit<PhraseSetSummary, 'lastUpdate'> & {
  lastUpdate: null;
};

export type SummaryFilter = 'all' | 'in_progress' | 'completed';
