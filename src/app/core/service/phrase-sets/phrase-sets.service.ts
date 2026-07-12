import { API } from '@/core/config/api-uris.config';
import { PhraseSet, PhraseSetWithPhrasesDto } from '@/core/types/phrase-set.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map, Observable } from 'rxjs';

export type PhraseSetFilter = 'all' | 'incomplete' | 'complete' | 'untouched';

export interface PaginatedPhraseSets {
  data: PhraseSet[];
  total: number;
}

export interface GetFilteredOptions {
  page: number;
  size: number;
  filter?: PhraseSetFilter;
}

@Injectable({
  providedIn: 'root',
})
export class PhraseSetsService {
  private readonly phraseSetsApi = API.PHRASE_SETS.PAGINATED;
  private readonly phraseSetByIdApi = API.PHRASE_SETS.BY_ID;
  private readonly client = inject(HttpClient);

  getPhraseSets(page: number, size: number): Observable<PhraseSet[]> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.client
      .get<PaginatedPhraseSets>(this.phraseSetsApi, { params })
      .pipe(map((response) => response.data));
  }

  getPhraseSetById(id: string) {
    return queryOptions({
      queryKey: ['phraseSet', id],
      queryFn: () =>
        lastValueFrom(this.client.get<PhraseSetWithPhrasesDto>(this.phraseSetByIdApi(id))),
    });
  }

  getFiltered({ page, size, filter }: GetFilteredOptions): Observable<PaginatedPhraseSets> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (filter) params = params.set('filter', filter);
    return this.client.get<PaginatedPhraseSets>(this.phraseSetsApi, { params });
  }

  getNextPending(): Observable<{ phraseSet: PhraseSet | null; state: 'in-progress' | 'finished' }> {
    return this.client.get<{ phraseSet: PhraseSet | null; state: 'in-progress' | 'finished' }>(
      API.PHRASE_SETS.NEXT_PENDING,
    );
  }
}
