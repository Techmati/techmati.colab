import { Phrase } from '@/core/types/phrase.type';

export type NewPhrase = Omit<Phrase, 'id' | 'createdAt' | 'updatedAt'>;
export type PersistedPhraseDraft = Phrase & { draftId: string };
export type NewPhraseDraft = NewPhrase & { draftId: string };
export type PhraseDraft = PersistedPhraseDraft | NewPhraseDraft;
export type PersistedPhraseDraftPayload = Omit<PersistedPhraseDraft, 'draftId'>;
export type NewPhraseDraftPayload = Omit<NewPhraseDraft, 'draftId'>;
export type PhraseDraftPayload = PersistedPhraseDraftPayload | NewPhraseDraftPayload;
