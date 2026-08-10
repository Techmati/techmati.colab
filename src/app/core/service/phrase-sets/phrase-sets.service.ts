import { API } from '@/core/config/api-uris.config';
import { PhraseSet, PhraseSetWithPhrasesDto } from '@/core/types/phrase-set.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { GuestService } from '../guest/guest.service';

export type PhraseSetFilter = 'all' | 'incomplete' | 'complete' | 'untouched';
export type PhraseSetUserSortBy = 'createdAt' | 'contributorsCount';
export type PhraseSetUserSortDirection = 'asc' | 'desc';

export interface PaginatedPhraseSets {
  data: PhraseSet[];
  total: number;
}

export interface GetFilteredOptions {
  page: number;
  size: number;
  filter?: PhraseSetFilter;
  sort_by?: PhraseSetUserSortBy;
  sort_direction?: PhraseSetUserSortDirection;
  include_stats?: 'true' | 'false';
  category?: string;
  contributorId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhraseSetsService {
  private readonly client = inject(HttpClient);
  private readonly guestService = inject(GuestService);

  private readonly isGuest = () => this.guestService.isGuest();

  getPhraseSetById(id: string) {
    const url = this.isGuest() ? API.GUEST.PHRASE_SET_BY_ID(id) : API.PHRASE_SETS.BY_ID(id);

    return queryOptions({
      queryKey: ['phraseSet', id],
      queryFn: () => lastValueFrom(this.client.get<PhraseSetWithPhrasesDto>(url)),
    });
  }

  getFiltered({ page, size, filter, sort_by, sort_direction, include_stats, category, contributorId }: GetFilteredOptions) {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (filter) params = params.set('filter', filter);
    if (sort_by) params = params.set('sort_by', sort_by);
    if (sort_direction) params = params.set('sort_direction', sort_direction);
    if (include_stats) params = params.set('include_stats', include_stats);
    if (category) params = params.set('category', category);
    if (contributorId && !this.isGuest()) params = params.set('contributorId', contributorId);

    const url = this.isGuest() ? API.GUEST.PHRASE_SETS : API.PHRASE_SETS.PAGINATED;

    return queryOptions({
      queryKey: ['phraseSets', { page, size, filter, sort_by, sort_direction, include_stats, category, contributorId }],
      queryFn: () => lastValueFrom(this.client.get<PaginatedPhraseSets>(url, { params })),
    });
  }

  getNextPending(contributorId: string) {
    const url = this.isGuest() ? API.GUEST.PHRASE_SETS_NEXT : API.PHRASE_SETS.NEXT_PENDING;
    const params = this.isGuest() ? undefined : { contributorId };

    return queryOptions({
      queryKey: ['phraseSets', 'nextPending'],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ phraseSet: PhraseSet | null; state: 'in-progress' | 'finished' }>(url, {
            params,
          }),
        ),
    });
  }
}
