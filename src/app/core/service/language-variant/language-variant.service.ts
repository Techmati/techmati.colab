import { API } from '@/core/config/api-uris.config';
import { LanguageVariant } from '@/core/types/language-variant.type';
import type { LanguageGroup } from '@/core/types/language-group.type';
import type { LanguageFamily } from '@/core/types/language-family.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { keepPreviousData, mutationOptions, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

export interface CreateLanguageVariantPayload {
  name: string;
  autodenominacion?: string;
  iso639Code?: string;
  inaliCode: string;
}

export interface UpdateLanguageVariantPayload {
  name?: string;
  autodenominacion?: string;
  iso639Code?: string;
  inaliCode?: string;
}

export interface LanguageVariantResponse extends LanguageVariant {
  group?: LanguageGroup | null;
  family?: LanguageFamily | null;
}

export interface VariantSearchParams {
  search?: string;
  includeGroup?: boolean;
  includeFamily?: boolean;
  groupId?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageVariantService {
  private readonly client = inject(HttpClient);

  search(params: VariantSearchParams = {}) {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 1).toString())
      .set('size', (params.size ?? 20).toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.includeGroup) httpParams = httpParams.set('include_group', 'true');
    if (params.includeFamily) httpParams = httpParams.set('include_family', 'true');
    if (params.groupId) httpParams = httpParams.set('group_id', params.groupId);

    return queryOptions({
      queryKey: ['language-variants', 'search', params],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ data: LanguageVariantResponse[]; total: number }>(
            API.LANGUAGE_VARIANTS.SEARCH,
            { params: httpParams },
          ),
        ),
      placeholderData: keepPreviousData,
    });
  }

  findById(id: string, includeGroup = false, includeFamily = false) {
    let params = new HttpParams();
    if (includeGroup) params = params.set('include_group', 'true');
    if (includeFamily) params = params.set('include_family', 'true');
    return queryOptions({
      queryKey: ['language-variants', 'detail', id, { includeGroup, includeFamily }],
      queryFn: () =>
        lastValueFrom(
          this.client.get<LanguageVariantResponse>(API.LANGUAGE_VARIANTS.BY_ID(id), { params }),
        ),
    });
  }

  create(groupId: string, payload: CreateLanguageVariantPayload) {
    return mutationOptions({
      mutationFn: () =>
        lastValueFrom(
          this.client.post<LanguageVariant>(API.LANGUAGE_GROUPS.VARIANTS(groupId), payload),
        ),
    });
  }

  update(id: string, payload: UpdateLanguageVariantPayload) {
    return mutationOptions({
      mutationFn: () =>
        lastValueFrom(this.client.put<LanguageVariant>(API.LANGUAGE_VARIANTS.BY_ID(id), payload)),
    });
  }

  delete(id: string) {
    return mutationOptions({
      mutationFn: () =>
        lastValueFrom(this.client.delete<void>(API.LANGUAGE_VARIANTS.BY_ID(id))),
    });
  }
}
