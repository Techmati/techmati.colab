import { Contributor } from './contributor.type';

export interface GuestSessionCredentials {
  sessionToken: string;
  recoveryCode: string;
}

export interface CreateGuestContributorPayload {
  fullName: string;
  variantIds?: string[];
}

export interface CreateGuestContributorResponse {
  contributor: Contributor;
  sessionToken: string;
  recoveryCode: string;
}

export interface RecoverSessionPayload {
  recoveryCode: string;
}

export interface ClaimGuestPayload {
  sessionToken: string;
}

export interface ClaimGuestResponse {
  contributorId: string;
}
