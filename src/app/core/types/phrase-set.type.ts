import { Phrase } from './phrase.type';

export interface PhraseSet {
  id: string;
  title: string;
  description?: string;
  language: PhraseSetLanguage;
  published: boolean;
  createdAt: string;
  publishedAt?: string;
  phraseCount: number;
  stats?: PhraseSetStats | null;
}

export type PhraseSetLanguage = 'nahuatl_to_spanish' | 'spanish_to_nahuatl';

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
