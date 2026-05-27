import { API } from '@/core/config/api-uris.config';
import { Contributor } from '@/core/types/contributor';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContributorService {
  private readonly registerApi = API.CONTRIBUTORS.REGISTER;
  private readonly profileApi = API.CONTRIBUTORS.PROFILE;
  private readonly client = inject(HttpClient);
  sessionId = signal(localStorage.getItem('sessionId'));
  // sessionId = computed(() => {
  //   const sessionId = this.nullableSessionId();
  //   if (!sessionId) throw new Error('No session ID found. User might not be logged in.');
  //   return sessionId;
  // });

  access(data: { fullName: string }) {
    return this.client.post<{ message: string; sessionId: string }>(this.registerApi, data).pipe(
      tap(({ sessionId }) => {
        console.log('Received session ID:', sessionId); // Debug log
        localStorage.setItem('sessionId', sessionId);
        this.sessionId.set(sessionId);
      }),
    );
  }

  isLoggedIn(): boolean {
    const sessionId = this.sessionId();
    console.log('Session ID:', sessionId); // Debug log
    return !!sessionId;
  }

  getProfile(sessionId: string = this.sessionId() || '') {
    return this.client.get<Contributor>(this.profileApi(sessionId));
  }
}
