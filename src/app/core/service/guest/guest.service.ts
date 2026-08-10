import { API } from '@/core/config/api-uris.config';
import { Contributor } from '@/core/types/contributor.type';
import {
  CreateGuestContributorPayload,
  CreateGuestContributorResponse,
  GuestSessionCredentials,
  RecoverSessionPayload,
} from '@/core/types/guest.type';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { mutationOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

export const GUEST_TOKEN_KEY = 'techmatiGuestSessionToken';
export const GUEST_RECOVERY_CODE_KEY = 'techmatiGuestRecoveryCode';

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  private readonly client = inject(HttpClient);

  readonly contributor = signal<Contributor | null>(null);
  readonly isGuest = computed(() => this.getSessionToken() !== null);

  create() {
    return mutationOptions({
      mutationFn: (payload: CreateGuestContributorPayload) =>
        lastValueFrom(
          this.client.post<CreateGuestContributorResponse>(API.GUEST.CONTRIBUTOR, payload),
        ),
    });
  }

  recover() {
    return mutationOptions({
      mutationFn: (payload: RecoverSessionPayload) =>
        lastValueFrom(
          this.client.post<GuestSessionCredentials>(API.GUEST.SESSION_RECOVER, payload),
        ),
    });
  }

  setContributor(contributor: Contributor): void {
    this.contributor.set(contributor);
  }

  getSessionToken(): string | null {
    return sessionStorage.getItem(GUEST_TOKEN_KEY);
  }

  setSessionToken(token: string): void {
    sessionStorage.setItem(GUEST_TOKEN_KEY, token);
  }

  getRecoveryCode(): string | null {
    return sessionStorage.getItem(GUEST_RECOVERY_CODE_KEY);
  }

  setRecoveryCode(code: string): void {
    sessionStorage.setItem(GUEST_RECOVERY_CODE_KEY, code);
  }

  clearGuestSession(): void {
    sessionStorage.removeItem(GUEST_TOKEN_KEY);
    sessionStorage.removeItem(GUEST_RECOVERY_CODE_KEY);
    this.contributor.set(null);
  }

  clearSessionToken(): void {
    sessionStorage.removeItem(GUEST_TOKEN_KEY);
  }
}
