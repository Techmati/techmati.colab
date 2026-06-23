import { PhraseSet } from '@/core/types/phrase-set.type';
import { Phrase } from '@/core/types/phrase.type';

export type PhraseSetUpdatePayload = Partial<Omit<PhraseSet, 'phrasesCount' | 'phrases'>> & {
  phrases?: Partial<Phrase>[];
};
