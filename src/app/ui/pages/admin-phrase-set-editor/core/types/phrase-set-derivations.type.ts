import { PhraseSet } from '@/core/types/phrase-set.type';
import { PhraseDraftPayload } from './phrase-derivations.type';

export type ExistingPhraseSetDraft = PhraseSet;
export type NewPhraseSetDraft = Omit<PhraseSet, 'id' | 'createdAt' | 'publishedAt' | 'phraseCount'>;
export type PhraseSetDraft = ExistingPhraseSetDraft | NewPhraseSetDraft;

export type PhraseSetUpdatePayload = Partial<Omit<PhraseSet, 'phraseCount' | 'phrases'>> & {
  phrases?: PhraseDraftPayload[];
};

export type PhraseSetCreatePayload = NewPhraseSetDraft & {
  phrases?: PhraseDraftPayload[];
};
