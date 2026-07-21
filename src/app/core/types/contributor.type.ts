import { LanguageVariant } from './language-variant.type';

export interface Contributor {
  id: string;
  ownerUserId: string;
  accountUserId: string | null;
  fullName: string;
  createdAt: string;
  variants: LanguageVariant[];
}

export interface ContributorSummary {
  id: string;
  ownerUserId: string;
  accountUserId: string | null;
  fullName: string;
  createdAt: string;
}
