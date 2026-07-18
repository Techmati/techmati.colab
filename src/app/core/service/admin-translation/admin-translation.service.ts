import { API } from '@/core/config/api-uris.config';
import { AdminContributorTranslationDetail } from '@/core/types/admin-translation.type';
import {
  AdminTranslationListItem,
  Translation,
  TranslationFilter,
} from '@/core/types/translation.type';
import { Pagination } from '@/core/types/utils.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { keepPreviousData, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

export interface ListByPhraseSetOptions extends Pagination {
  filter?: TranslationFilter;
  search?: string;
}

export interface ListByContributorAdminOptions extends Pagination {
  filter?: TranslationFilter;
  include_phrase_set?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminTranslationService {
  private readonly client = inject(HttpClient);

  listByPhraseSet(phraseSetId: string, { filter, search, page, size }: ListByPhraseSetOptions) {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (filter) params = params.set('filter', filter);
    if (search) params = params.set('search', search);

    return queryOptions({
      queryKey: ['admin', 'phrase-set-translations', phraseSetId, { filter, search, page, size }],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ data: AdminTranslationListItem[]; total: number }>(
            API.ADMIN.PHRASE_SET.TRANSLATIONS(phraseSetId),
            { params },
          ),
        ),
      placeholderData: keepPreviousData,
    });
  }

  listByContributor(contributorId: string, { filter, page, size, include_phrase_set }: ListByContributorAdminOptions) {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (filter) params = params.set('filter', filter);
    if (include_phrase_set) params = params.set('include_phrase_set', 'true');

    return queryOptions({
      queryKey: ['admin', 'contributor-translations', contributorId, { filter, page, size, include_phrase_set }],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ data: Translation[]; total: number }>(
            API.ADMIN.CONTRIBUTORS.TRANSLATIONS(contributorId),
            { params },
          ),
        ),
      placeholderData: keepPreviousData,
    });
  }

  getContributorTranslationDetail(contributorId: string, translationId: string) {
    return queryOptions({
      queryKey: ['admin', 'contributor-translation-detail', contributorId, translationId],
      queryFn: () =>
        lastValueFrom(
          this.client.get<AdminContributorTranslationDetail>(
            API.ADMIN.CONTRIBUTORS.TRANSLATION_DETAIL(contributorId, translationId),
          ),
        ),
    });
  }
}
