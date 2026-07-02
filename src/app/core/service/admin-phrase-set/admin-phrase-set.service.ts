import { API } from '@/core/config/api-uris.config';
import { PhraseSet } from '@/core/types/phrase-set.type';
import { Phrase } from '@/core/types/phrase.type';
import { Pagination } from '@/core/types/utils.type';
import {
  PhraseSetCreatePayload,
  PhraseSetUpdatePayload,
} from '@/ui/pages/admin-phrase-set-editor/core/types/phrase-set-derivations.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  keepPreviousData,
  mutationOptions,
  QueryClient,
  queryOptions,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

export type AdminPhraseSetSortBy = 'createdAt' | 'title' | 'phraseCount' | 'contributorsCount';
export type AdminPhraseSetSortDirection = 'asc' | 'desc';

export interface AdminPhraseSetSearchQuery extends Pagination {
  readonly search?: string;
  readonly includeStats?: boolean;
  readonly minContributors?: number | null;
  readonly sortBy?: AdminPhraseSetSortBy;
  readonly sortDirection?: AdminPhraseSetSortDirection;
}

export interface AdminPhraseSetSearchResponse<TPhraseSet extends PhraseSet = PhraseSet> {
  readonly phraseSets: TPhraseSet[];
  readonly total: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminPhraseSetService {
  private readonly client = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  private readonly searchApi = API.ADMIN.PHRASE_SET.SEARCH;

  search<TPhraseSet extends PhraseSet = PhraseSet>(query: AdminPhraseSetSearchQuery) {
    return queryOptions({
      queryKey: ['phrase-set', 'search', query],
      queryFn: () =>
        lastValueFrom(
          this.client.get<AdminPhraseSetSearchResponse<TPhraseSet>>(this.searchApi, {
            params: this.buildSearchParams(query),
          }),
        ),
      placeholderData: keepPreviousData,
    });
  }

  findPhrases(phraseSetId: string, { page, size }: Pagination) {
    return queryOptions({
      queryKey: ['phrase-set', phraseSetId, 'phrases', { page, size }],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ phrases: Phrase[]; total: number }>(
            API.ADMIN.PHRASE_SET.PHRASES(phraseSetId),
            { params: { page: page.toString(), size: size.toString() } },
          ),
        ),
    });
  }

  findById(phraseSetId: string) {
    return queryOptions({
      queryKey: ['phrase-set', phraseSetId],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ phraseSet: PhraseSet }>(API.ADMIN.PHRASE_SET.BY_ID(phraseSetId)),
        ),
    });
  }

  update(
    phraseSetId: string,
    phraseSet: PhraseSetUpdatePayload,
    onSuccessCallback?: () => void,
    onErrorCallback?: () => void,
  ) {
    return mutationOptions({
      mutationKey: ['phrase-set', phraseSetId, 'update'],
      mutationFn: () =>
        lastValueFrom(this.client.put(API.ADMIN.PHRASE_SET.BY_ID(phraseSetId), phraseSet)),
      onSuccess: async () => {
        await this.queryClient.invalidateQueries({ queryKey: ['phrase-set', phraseSetId] });
        onSuccessCallback?.();
      },
      onError: () => {
        onErrorCallback?.();
      },
    });
  }

  create(
    phraseSet: PhraseSetCreatePayload,
    onSuccessCallback?: () => void,
    onErrorCallback?: () => void,
  ) {
    return mutationOptions({
      mutationKey: ['phrase-set', 'create'],
      mutationFn: () => lastValueFrom(this.client.post(this.searchApi, phraseSet)),
      onSuccess: async () => {
        await this.queryClient.invalidateQueries({ queryKey: ['phrase-set'] });
        onSuccessCallback?.();
      },
      onError: () => {
        onErrorCallback?.();
      },
    });
  }

  private buildSearchParams({
    search,
    includeStats,
    minContributors,
    sortBy,
    sortDirection,
    page,
    size,
  }: AdminPhraseSetSearchQuery): Record<string, string> {
    const params: Record<string, string> = {
      page: page.toString(),
      size: size.toString(),
    };

    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      params['search'] = trimmedSearch;
    }

    if (includeStats !== undefined) {
      params['includeStats'] = includeStats.toString();
    }

    if (minContributors !== null && minContributors !== undefined) {
      params['minContributors'] = minContributors.toString();
    }

    if (sortBy) {
      params['sortBy'] = sortBy;
    }

    if (sortDirection) {
      params['sortDirection'] = sortDirection;
    }

    return params;
  }
}
