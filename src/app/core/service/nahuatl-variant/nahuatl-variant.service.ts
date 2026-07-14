import { API } from '@/core/config/api-uris.config';
import { NahuatlVariant } from '@/core/types/nahuatl-variant.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map, Observable } from 'rxjs';

export interface CreateNahuatlVariantPayload {
  code: string;
  label: string;
}

export interface UpdateNahuatlVariantPayload {
  code?: string;
  label?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NahuatlVariantService {
  private readonly client = inject(HttpClient);

  list() {
    return queryOptions({
      queryKey: ['nahuatl-variants'],
      queryFn: () =>
        lastValueFrom(
          this.client
            .get<{ data: NahuatlVariant[] }>(API.NAHUATL_VARIANTS.LIST)
            .pipe(map((response) => response.data)),
        ),
    });
  }

  create(payload: CreateNahuatlVariantPayload): Observable<NahuatlVariant> {
    return this.client.post<NahuatlVariant>(API.NAHUATL_VARIANTS.LIST, payload);
  }

  update(id: string, payload: UpdateNahuatlVariantPayload): Observable<NahuatlVariant> {
    return this.client.put<NahuatlVariant>(API.NAHUATL_VARIANTS.BY_ID(id), payload);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.client.delete<{ message: string }>(API.NAHUATL_VARIANTS.BY_ID(id));
  }
}
