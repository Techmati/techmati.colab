import { Profile } from '../dto/profile.dto';
import { PhraseSet } from './phrase-set.type';
import { Phrase } from './phrase.type';
import { TranslationEntry } from './translation-entry.type';

export interface Summary {
  userId: string;
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

export type UserPhraseSetContributionSummary = Summary & {
  phraseSet: PhraseSet & {
    phrases: Array<
      Phrase & {
        translationEntries: TranslationEntry[];
      }
    >;
  };
};

export type PhraseSetContributorSummary = Summary & {
  contributor: Profile | null;
  phraseSet: PhraseSet | null;
};

export type UserPhraseSetTranslationEntry = TranslationEntry & {
  phrase: Phrase;
};

export interface UserPhraseSetTranslationDetail {
  summary: PhraseSetContributorSummary;
  entries: UserPhraseSetTranslationEntry[];
}

export type SummaryFilter = 'all' | 'in_progress' | 'completed';
