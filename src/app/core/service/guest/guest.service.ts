import { API } from '@/core/config/api-uris.config';
import {
  CreateGuestContributorPayload,
  CreateGuestContributorResponse,
  GuestSessionCredentials,
  RecoverSessionPayload,
} from '@/core/types/guest.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mutationOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

export const GUEST_TOKEN_KEY = 'techmatiGuestSessionToken';

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  private readonly client = inject(HttpClient);

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

  getSessionToken(): string | null {
    return sessionStorage.getItem(GUEST_TOKEN_KEY);
  }

  setSessionToken(token: string): void {
    sessionStorage.setItem(GUEST_TOKEN_KEY, token);
  }

  clearSessionToken(): void {
    sessionStorage.removeItem(GUEST_TOKEN_KEY);
  }
}
