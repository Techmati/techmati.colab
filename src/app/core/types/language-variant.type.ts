import { LanguageFamily } from './language-family.type';
import { LanguageGroup } from './language-group.type';

export interface LanguageVariant {
  id: string;
  groupId: string;
  name: string;
  autodenominacion: string | null;
  iso639Code: string | null;
  inaliCode: string;
  group?: LanguageGroup | null;
  family?: LanguageFamily | null;
}
