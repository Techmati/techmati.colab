import { PhraseSet } from './phrase-set.type';

export interface ContributorSummaryResponse {
  phraseSetsInProgress: PhraseSetsInProgress[];
}

export interface PhraseSetsInProgress {
  phraseSet: PhraseSet;
  progressPercentage: number;
  contributedEntriesCount: number;
  totalPhrases: number;
  lastUpdate: string;
}
