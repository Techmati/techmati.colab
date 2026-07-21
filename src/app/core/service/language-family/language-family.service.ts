import { API } from '@/core/config/api-uris.config';
import { LanguageFamily } from '@/core/types/language-family.type';
import { LanguageGroup } from '@/core/types/language-group.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mutationOptions, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

export interface CreateLanguageFamilyPayload {
  name: string;
  iso639Code?: string;
  inaliCode: string;
}

export interface UpdateLanguageFamilyPayload {
  name?: string;
  iso639Code?: string;
  inaliCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageFamilyService {
  private readonly client = inject(HttpClient);

  list() {
    return queryOptions({
      queryKey: ['language-families', 'list'],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ data: LanguageFamily[] }>(API.LANGUAGE_FAMILIES.LIST),
        ),
    });
  }

  findById(id: string) {
    return queryOptions({
      queryKey: ['language-families', 'detail', id],
      queryFn: () =>
        lastValueFrom(this.client.get<LanguageFamily>(API.LANGUAGE_FAMILIES.BY_ID(id))),
    });
  }

  groups(familyId: string, includeFamily = false) {
    let params = new HttpParams();
    if (includeFamily) params = params.set('include_family', 'true');
    return queryOptions({
      queryKey: ['language-families', 'groups', familyId, { includeFamily }],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ data: LanguageGroup[] }>(
            API.LANGUAGE_FAMILIES.GROUPS(familyId),
            { params },
          ),
        ),
    });
  }

  create(payload: CreateLanguageFamilyPayload) {
    return mutationOptions({
      mutationFn: () =>
        lastValueFrom(this.client.post<LanguageFamily>(API.LANGUAGE_FAMILIES.LIST, payload)),
    });
  }

  update(id: string, payload: UpdateLanguageFamilyPayload) {
    return mutationOptions({
      mutationFn: () =>
        lastValueFrom(this.client.put<LanguageFamily>(API.LANGUAGE_FAMILIES.BY_ID(id), payload)),
    });
  }

  delete(id: string) {
    return mutationOptions({
      mutationFn: () =>
        lastValueFrom(this.client.delete<void>(API.LANGUAGE_FAMILIES.BY_ID(id))),
    });
  }
}
