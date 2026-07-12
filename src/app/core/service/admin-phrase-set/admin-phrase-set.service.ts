import { API } from '@/core/config/api-uris.config';
import { PhraseSet } from '@/core/types/phrase-set.type';
import { Phrase } from '@/core/types/phrase.type';
import { Pagination } from '@/core/types/utils.type';
import {
  PhraseSetCreatePayload,
  PhraseSetUpdatePayload,
} from '@/ui/pages/admin-phrase-set-editor/core/types/phrase-set-derivations.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  keepPreviousData,
  mutationOptions,
  QueryClient,
  queryOptions,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom, Observable } from 'rxjs';

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
  readonly data: TPhraseSet[];
  readonly total: number;
}

export interface PaginatedPhrases {
  data: Phrase[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminPhraseSetService {
  private readonly client = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  private readonly searchApi = API.ADMIN.PHRASE_SET.SEARCH;

  search<TPhraseSet extends PhraseSet = PhraseSet>(
    query: AdminPhraseSetSearchQuery,
  ): Observable<AdminPhraseSetSearchResponse<TPhraseSet>> {
    return this.client.get<AdminPhraseSetSearchResponse<TPhraseSet>>(this.searchApi, {
      params: this.buildSearchParams(query),
    });
  }

  searchQuery<TPhraseSet extends PhraseSet = PhraseSet>(query: AdminPhraseSetSearchQuery) {
    return queryOptions({
      queryKey: ['admin', 'phrase-set-search', query],
      queryFn: () => lastValueFrom(this.search<TPhraseSet>(query)),
      placeholderData: keepPreviousData,
    });
  }

  findPhrases(phraseSetId: string, { page, size }: Pagination): Observable<PaginatedPhrases> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.client.get<PaginatedPhrases>(API.ADMIN.PHRASE_SET.PHRASES(phraseSetId), { params });
  }

  findPhrasesQuery(phraseSetId: string, params: Pagination) {
    return queryOptions({
      queryKey: ['admin', 'phrase-set-phrases', phraseSetId, params],
      queryFn: () => lastValueFrom(this.findPhrases(phraseSetId, params)),
    });
  }

  findById(phraseSetId: string): Observable<PhraseSet> {
    return this.client.get<PhraseSet>(API.ADMIN.PHRASE_SET.BY_ID(phraseSetId));
  }

  findByIdQuery(phraseSetId: string) {
    return queryOptions({
      queryKey: ['admin', 'phrase-set', phraseSetId],
      queryFn: () => lastValueFrom(this.findById(phraseSetId)),
    });
  }

  create(phraseSet: PhraseSetCreatePayload): Observable<PhraseSet> {
    return this.client.post<PhraseSet>(this.searchApi, phraseSet);
  }

  createMutation() {
    return {
      mutationFn: (phraseSet: PhraseSetCreatePayload) => lastValueFrom(this.create(phraseSet)),
    };
  }

  update(phraseSetId: string, phraseSet: PhraseSetUpdatePayload): Observable<PhraseSet> {
    return this.client.put<PhraseSet>(API.ADMIN.PHRASE_SET.BY_ID(phraseSetId), phraseSet);
  }

  updateMutation(phraseSetId: string) {
    return {
      mutationFn: (phraseSet: PhraseSetUpdatePayload) =>
        lastValueFrom(this.update(phraseSetId, phraseSet)),
    };
  }

  delete(phraseSetId: string) {
    return mutationOptions({
      mutationFn: () =>
        lastValueFrom(this.client.delete<void>(API.ADMIN.PHRASE_SET.BY_ID(phraseSetId))),
    });
  }

  invalidateSearch() {
    this.queryClient.invalidateQueries({ queryKey: ['admin', 'phrase-set-search'] });
  }

  private buildSearchParams({
    search,
    includeStats,
    minContributors,
    sortBy,
    sortDirection,
    page,
    size,
  }: AdminPhraseSetSearchQuery): HttpParams {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      params = params.set('search', trimmedSearch);
    }

    if (includeStats !== undefined) {
      params = params.set('include_stats', includeStats.toString());
    }

    if (minContributors !== null && minContributors !== undefined) {
      params = params.set('min_contributors', minContributors.toString());
    }

    if (sortBy) {
      params = params.set('sort_by', sortBy);
    }

    if (sortDirection) {
      params = params.set('sort_direction', sortDirection);
    }

    return params;
  }
}
