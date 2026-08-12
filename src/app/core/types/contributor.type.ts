import { LanguageVariant } from './language-variant.type';

export interface Contributor {
  id: string;
  ownerUserId: string | null;
  accountUserId: string | null;
  alias: string;
  createdAt: string;
  variants: LanguageVariant[];
}

export interface ContributorSummary {
  id: string;
  ownerUserId: string | null;
  accountUserId: string | null;
  alias: string;
  createdAt: string;
}
