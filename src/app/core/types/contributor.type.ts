import { NahuatlVariant } from './nahuatl-variant.type';

export interface Contributor {
  id: string;
  ownerUserId: string;
  accountUserId: string | null;
  fullName: string;
  createdAt: string;
  variants: NahuatlVariant[];
}

export interface ContributorSummary {
  id: string;
  ownerUserId: string;
  accountUserId: string | null;
  fullName: string;
  createdAt: string;
}
