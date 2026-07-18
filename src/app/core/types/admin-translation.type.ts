import { Contributor } from './contributor.type';
import { PhraseSet } from './phrase-set.type';
import { TranslationEntry } from './translation-entry.type';
import { Translation } from './translation.type';

export interface AdminContributorTranslationDetail {
  translation: Translation;
  entries: TranslationEntry[];
  contributor?: Contributor;
  phraseSet?: PhraseSet;
}

export interface AutoContributor {
  contributorId: string;
}
