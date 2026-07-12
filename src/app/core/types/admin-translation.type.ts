import { Translation } from './translation.type';
import { TranslationEntry } from './translation-entry.type';

export interface AdminContributorTranslationDetail {
  translation: Translation;
  entries: TranslationEntry[];
}

export interface AutoContributor {
  contributorId: string;
}
