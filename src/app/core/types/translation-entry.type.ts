import { Phrase } from './phrase.type';

export interface TranslationEntry {
  id: string;
  phraseId: string;
  contributorId: string;
  translation: string;
  submittedAt: string;
  audioUrl: string;
}

export type TranslatedPhrase = TranslationEntry & { phrase: Phrase };
export type TranslationEntrySubmitRequest = Omit<
  TranslationEntry,
  'id' | 'contributorId' | 'submittedAt' | 'audioUrl'
>;
