import { Phrase } from './phrase.type';

export interface TranslationEntry {
  id: string;
  translationId: string;
  phraseId: string;
  translation: string;
  audioUrl: string | null;
  submittedAt: string;
  phrase?: Phrase;
}

export interface TranslationEntrySubmitPayload {
  phraseId: string;
  translation: string;
}
