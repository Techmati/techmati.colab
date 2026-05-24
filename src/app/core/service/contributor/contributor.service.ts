import { API } from '@/core/config/api-uris.config';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContributorService {
  private readonly registerApi = API.CONTRIBUTORS.REGISTER;
  private readonly loginApi = API.CONTRIBUTORS.LOGIN;

  private readonly client = inject(HttpClient);

  access(data: { fullName: string }) {
    return this.client.post<{ message: string; sessionId: string }>(this.registerApi, data).pipe(
      tap((response) => {
        localStorage.setItem('sessionId', response.sessionId);
      }),
    );
  }

  // async login(data: { fullName: string }) {
  //   let sessionId = localStorage.getItem('sessionId');
  //   if (sessionId) {
  //     return sessionId;
  //   }
  //   const [result, error] = await tryCatch(this.client.post<{ message: string; sessionId: string }>(this.loginApi, data))
  //   if(error) {
  //     throw new Error('Error al iniciar sesión');
  //   }
  //   localStorage.setItem('sessionId', result.sessionId);
  //   return result.sessionId;
  // }

  isLoggedIn(): boolean {
    const sessionId = localStorage.getItem('sessionId');
    console.log('Session ID:', sessionId); // Debug log
    return !!sessionId;
  }
}
