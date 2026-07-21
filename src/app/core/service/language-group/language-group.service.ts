import { API } from '@/core/config/api-uris.config';
import { LanguageGroup } from '@/core/types/language-group.type';
import { LanguageVariant } from '@/core/types/language-variant.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mutationOptions, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

export interface CreateLanguageGroupPayload {
  name: string;
  iso639Code?: string;
  inaliCode: string;
}

export interface UpdateLanguageGroupPayload {
  name?: string;
  iso639Code?: string;
  inaliCode?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageGroupService {
  private readonly client = inject(HttpClient);

  findById(id: string, includeFamily = false) {
    let params = new HttpParams();
    if (includeFamily) params = params.set('include_family', 'true');
    return queryOptions({
      queryKey: ['language-groups', 'detail', id, { includeFamily }],
      queryFn: () =>
        lastValueFrom(
          this.client.get<LanguageGroup>(API.LANGUAGE_GROUPS.BY_ID(id), { params }),
        ),
    });
  }

  variants(groupId: string, includeGroup = false, includeFamily = false) {
    let params = new HttpParams();
    if (includeGroup) params = params.set('include_group', 'true');
    if (includeFamily) params = params.set('include_family', 'true');
    return queryOptions({
      queryKey: ['language-groups', 'variants', groupId, { includeGroup, includeFamily }],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ data: LanguageVariant[] }>(
            API.LANGUAGE_GROUPS.VARIANTS(groupId),
            { params },
          ),
        ),
    });
  }

  create(familyId: string, payload: CreateLanguageGroupPayload) {
    return mutationOptions({
      mutationFn: () =>
        lastValueFrom(
          this.client.post<LanguageGroup>(API.LANGUAGE_FAMILIES.GROUPS(familyId), payload),
        ),
    });
  }

  update(id: string, payload: UpdateLanguageGroupPayload) {
    return mutationOptions({
      mutationFn: () =>
        lastValueFrom(this.client.put<LanguageGroup>(API.LANGUAGE_GROUPS.BY_ID(id), payload)),
    });
  }

  delete(id: string) {
    return mutationOptions({
      mutationFn: () =>
        lastValueFrom(this.client.delete<void>(API.LANGUAGE_GROUPS.BY_ID(id))),
    });
  }
}
