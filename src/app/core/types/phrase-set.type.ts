import { Phrase } from './phrase.type';
import type { PhraseSetCategory } from '@/core/config/phrase-set-category-labels.config';

export interface PhraseSet {
  id: string;
  title: string;
  description?: string;
  category: PhraseSetCategory;
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
