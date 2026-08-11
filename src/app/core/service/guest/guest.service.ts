import { API } from '@/core/config/api-uris.config';
import { Contributor } from '@/core/types/contributor.type';
import {
  CreateGuestContributorPayload,
  CreateGuestContributorResponse,
  GuestSessionCredentials,
  RecoverSessionPayload,
} from '@/core/types/guest.type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { injectQuery, mutationOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

export const GUEST_TOKEN_KEY = 'techmatiGuestSessionToken';
export const GUEST_RECOVERY_CODE_KEY = 'techmatiGuestRecoveryCode';

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  private readonly client = inject(HttpClient);

  private readonly contributorRes = injectQuery(() => {
    const sessionToken = this.getSessionToken();

    const headers = new HttpHeaders();
    headers.set('X-Guest-Session-Token', sessionToken ?? '');

    return {
      queryKey: ['guest', 'contributor'],
      queryFn: () =>
        lastValueFrom(this.client.get<Contributor>(API.GUEST.CONTRIBUTOR, { headers })),
      enabled: !!sessionToken,
    };
  });

  readonly contributor = linkedSignal<Contributor | null>(() => {
    if (this.contributorRes.isPending()) {
      return null;
    }
    return this.contributorRes.data()!;
  });

  readonly isGuestTick = signal(0);

  readonly isGuest = computed((): boolean => {
    return this.getSessionToken() !== null || this.contributor() !== null;
  });

  create() {
    return mutationOptions({
      mutationFn: (payload: CreateGuestContributorPayload) =>
        lastValueFrom(this.client.post<CreateGuestContributorResponse>(API.GUEST.CREATE, payload)),
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
    this.isGuestTick.update((v) => v + 1);
    this.contributor.set(contributor);
  }

  getSessionToken(): string | null {
    return sessionStorage.getItem(GUEST_TOKEN_KEY);
  }

  setSessionToken(token: string): void {
    this.isGuestTick.update((v) => v + 1);
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
    this.isGuestTick.update((v) => v + 1);
  }

  clearSessionToken(): void {
    sessionStorage.removeItem(GUEST_TOKEN_KEY);
    this.isGuestTick.update((v) => v + 1);
  }
}
