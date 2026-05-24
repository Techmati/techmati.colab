import { API } from '@/core/config/api-uris.config';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContributorService {
  private readonly registerApi = API.CONTRIBUTORS.REGISTER;

  private readonly client = inject(HttpClient);

  register(data: { fullName: string }) {
    return this.client.post(this.registerApi, data);
  }
}
