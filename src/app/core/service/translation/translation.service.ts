import { API } from '@/core/config/api-uris.config';
import { ContributorTranslationStats } from '@/core/types/contributor-stats.type';
import {
  TranslationEntry,
  TranslationEntrySubmitPayload,
} from '@/core/types/translation-entry.type';
import { Translation, TranslationFilter } from '@/core/types/translation.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryClient, mutationOptions, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { GuestService } from '../guest/guest.service';

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
  contributorId?: string;
  translationId: string;
  payload: TranslationEntrySubmitPayload;
  audio?: File;
}

export interface CreateTranslationPayload {
  phraseSetId: string;
  variantId: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly client = inject(HttpClient);
  private readonly guestService = inject(GuestService);
  private readonly queryClient = inject(QueryClient);

  private readonly isGuest = () => this.guestService.isGuest();

  listByContributor(contributorId: string | undefined, options: ListByContributorOptions = {}) {
    let params = new HttpParams();
    if (options.filter) params = params.set('filter', options.filter);
    if (options.page !== undefined) params = params.set('page', options.page.toString());
    if (options.size !== undefined) params = params.set('size', options.size.toString());
    if (options.include_phrase_set) params = params.set('include_phrase_set', 'true');

    const url = this.isGuest()
      ? API.GUEST.TRANSLATIONS
      : API.CONTRIBUTORS.TRANSLATIONS.LIST(contributorId!);

    return queryOptions({
      queryKey: ['translation', 'list', contributorId, options],
      queryFn: () => lastValueFrom(this.client.get<PaginatedTranslations>(url, { params })),
    });
  }

  getStats(contributorId: string | undefined) {
    const url = this.isGuest()
      ? API.GUEST.TRANSLATION_STATS
      : API.CONTRIBUTORS.TRANSLATIONS.STATS(contributorId!);

    return queryOptions({
      queryKey: ['translation', 'stats', contributorId],
      queryFn: () => lastValueFrom(this.client.get<ContributorTranslationStats>(url)),
    });
  }

  create(contributorId: string | undefined, onSuccess?: () => void, onError?: () => void) {
    const url = this.isGuest()
      ? API.GUEST.TRANSLATIONS
      : API.CONTRIBUTORS.TRANSLATIONS.CREATE(contributorId!);

    return mutationOptions({
      mutationKey: ['translation', 'create', contributorId],
      mutationFn: (payload: CreateTranslationPayload) =>
        lastValueFrom(this.client.post<Translation>(url, payload)),
      onSuccess: async () => {
        await this.queryClient.invalidateQueries({ queryKey: ['phrase-set'] });
        await this.queryClient.invalidateQueries({ queryKey: ['translation'] });
        onSuccess?.();
      },
      onError: () => onError?.(),
    });
  }

  findById(contributorId: string | undefined, translationId: string) {
    const url = this.isGuest()
      ? API.GUEST.TRANSLATION_BY_ID(translationId)
      : API.CONTRIBUTORS.TRANSLATIONS.DETAIL(contributorId!, translationId);

    return queryOptions({
      queryKey: ['translation', 'detail', contributorId, translationId],
      queryFn: () => lastValueFrom(this.client.get<Translation>(url)),
    });
  }

  delete(
    contributorId: string | undefined,
    translationId: string,
    onSuccess?: () => void,
    onError?: () => void,
  ) {
    const url = this.isGuest()
      ? API.GUEST.TRANSLATION_BY_ID(translationId)
      : API.CONTRIBUTORS.TRANSLATIONS.DELETE(contributorId!, translationId);

    return mutationOptions({
      mutationKey: ['translation', 'delete', contributorId, translationId],
      mutationFn: () => lastValueFrom(this.client.delete<{ message: string }>(url)),
      onSuccess: async () => {
        await this.queryClient.invalidateQueries({ queryKey: ['phrase-set'] });
        await this.queryClient.invalidateQueries({ queryKey: ['translation'] });
        onSuccess?.();
      },
      onError: () => onError?.(),
    });
  }

  getNextPending(contributorId: string | undefined, translationId: string) {
    const url = this.isGuest()
      ? API.GUEST.TRANSLATION_NEXT_PENDING(translationId)
      : API.CONTRIBUTORS.TRANSLATIONS.NEXT_PENDING(contributorId!, translationId);

    return queryOptions({
      queryKey: ['translation', 'next-pending', contributorId, translationId],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ phraseId: string | null; state: 'in-progress' | 'finished' }>(url),
        ),
    });
  }

  submitEntry(onSuccess?: () => void, onError?: (error: unknown) => void) {
    return mutationOptions({
      mutationFn: ({ contributorId, translationId, payload, audio }: SubmitEntryPayload) => {
        const formData = new FormData();
        formData.append('data', JSON.stringify(payload));
        if (audio) {
          formData.append('audio', audio);
        }

        const url = this.isGuest()
          ? API.GUEST.TRANSLATION_ENTRIES(translationId)
          : API.CONTRIBUTORS.TRANSLATIONS.SUBMIT_ENTRY(contributorId!, translationId);

        return lastValueFrom(this.client.post<TranslationEntry>(url, formData));
      },
      onSuccess: async () => {
        await this.queryClient.invalidateQueries({ queryKey: ['phrase-set'] });
        await this.queryClient.invalidateQueries({ queryKey: ['translation'] });
        onSuccess?.();
      },
      onError: (error) => onError?.(error),
    });
  }

  invalidateAll() {
    this.queryClient.invalidateQueries({ queryKey: ['translation'] });
  }
}
