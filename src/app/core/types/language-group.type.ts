import { LanguageFamily } from './language-family.type';

export interface LanguageGroup {
  id: string;
  familyId: string;
  name: string;
  iso639Code: string | null;
  inaliCode: string;
  family?: LanguageFamily | null;
}
