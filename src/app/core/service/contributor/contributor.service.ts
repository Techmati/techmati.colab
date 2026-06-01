import { API } from '@/core/config/api-uris.config';
import { Contributor } from '@/core/types/contributor';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContributorService {
  private readonly registerApi = API.CONTRIBUTORS.REGISTER;
  private readonly profileApi = API.CONTRIBUTORS.PROFILE;
  private readonly client = inject(HttpClient);

  sessionId = signal(localStorage.getItem('sessionId'));
  private profile = signal<Contributor | null>(null);
  access(data: { fullName: string }) {
    return this.client.post<{ message: string; sessionId: string }>(this.registerApi, data).pipe(
      tap(({ sessionId }) => {
        localStorage.setItem('sessionId', sessionId);
        this.sessionId.set(sessionId);
        this.cacheProfile();
      }),
    );
  }

  isLoggedIn(): boolean {
    const sessionId = this.sessionId();
    console.log('Session ID:', sessionId); // Debug log
    return !!sessionId;
  }

  getProfile(sessionId: string = this.sessionId() || '') {
    const profile = this.profile();
    if (profile) return of(profile);
    return this.client.get<Contributor>(this.profileApi(sessionId));
  }

  logout() {
    localStorage.removeItem('sessionId');
    this.sessionId.set(null);
  }

  constructor() {
    this.cacheProfile();
  }

  private cacheProfile() {
    const sessionId = this.sessionId();
    if (sessionId) this.getProfile().subscribe((profile) => this.profile.set(profile));
  }
}
