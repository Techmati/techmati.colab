import { API } from '@/core/config/api-uris.config';
import { ContributorTranslationStats } from '@/core/types/contributor-stats.type';
import {
  TranslationEntry,
  TranslationEntrySubmitPayload,
} from '@/core/types/translation-entry.type';
import { Translation, TranslationFilter } from '@/core/types/translation.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mutationOptions, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

export interface ListByContributorOptions {
  filter?: TranslationFilter;
  page?: number;
  size?: number;
  include_phrase_set?: boolean;
}

export interface PaginatedTranslations {
  data: Translation[];
  total: number;
}

export interface SubmitEntryPayload {
  contributorId: string;
  translationId: string;
  payload: TranslationEntrySubmitPayload;
  audio?: File;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly client = inject(HttpClient);

  listByContributor(contributorId: string, options: ListByContributorOptions = {}) {
    let params = new HttpParams();
    if (options.filter) params = params.set('filter', options.filter);
    if (options.page !== undefined) params = params.set('page', options.page.toString());
    if (options.size !== undefined) params = params.set('size', options.size.toString());
    if (options.include_phrase_set) params = params.set('include_phrase_set', 'true');

    return queryOptions({
      queryKey: ['translations', contributorId, options],
      queryFn: () =>
        lastValueFrom(
          this.client.get<PaginatedTranslations>(API.CONTRIBUTORS.TRANSLATIONS.LIST(contributorId), {
            params,
          }),
        ),
    });
  }

  getStats(contributorId: string) {
    return queryOptions({
      queryKey: ['translation-stats', contributorId],
      queryFn: () =>
        lastValueFrom(
          this.client.get<ContributorTranslationStats>(
            API.CONTRIBUTORS.TRANSLATIONS.STATS(contributorId),
          ),
        ),
    });
  }

  create(contributorId: string) {
    return mutationOptions({
      mutationKey: ['translation', 'create', contributorId],
      mutationFn: (payload: { phraseSetId: string; variantId: string | null }) =>
        lastValueFrom(
          this.client.post<Translation>(
            API.CONTRIBUTORS.TRANSLATIONS.CREATE(contributorId),
            payload,
          ),
        ),
    });
  }

  findById(contributorId: string, translationId: string) {
    return queryOptions({
      queryKey: ['translation', contributorId, translationId],
      queryFn: () =>
        lastValueFrom(
          this.client.get<Translation>(
            API.CONTRIBUTORS.TRANSLATIONS.DETAIL(contributorId, translationId),
          ),
        ),
    });
  }

  getNextPending(contributorId: string, translationId: string) {
    return queryOptions({
      queryKey: ['next-pending', contributorId, translationId],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ phraseId: string | null; state: 'in-progress' | 'finished' }>(
            API.CONTRIBUTORS.TRANSLATIONS.NEXT_PENDING(contributorId, translationId),
          ),
        ),
    });
  }

  submitEntry() {
    return mutationOptions({
      mutationFn: ({ contributorId, translationId, payload, audio }: SubmitEntryPayload) => {
        const formData = new FormData();
        formData.append('data', JSON.stringify(payload));
        if (audio) {
          formData.append('audio', audio);
        }
        return lastValueFrom(
          this.client.post<TranslationEntry>(
            API.CONTRIBUTORS.TRANSLATIONS.SUBMIT_ENTRY(contributorId, translationId),
            formData,
          ),
        );
      },
    });
  }
}
