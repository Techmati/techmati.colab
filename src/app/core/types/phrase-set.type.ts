import { Phrase } from './phrase.type';

export interface PhraseSet {
  id: string;
  title: string;
  description?: string;
  language: string;
  published: boolean;
  createdAt: string;
  publishedAt?: string;
  phraseCount: number;
  stats?: PhraseSetStats | null;
}

export interface PhraseSetWithPhrasesDto extends PhraseSet {
  phrases: Phrase[];
}
export interface PhraseSetWithStats extends PhraseSet {
  stats: PhraseSetStats;
}

export interface PhraseSetStats {
  phraseSetId: string;
  contributorsCount: number;
}
