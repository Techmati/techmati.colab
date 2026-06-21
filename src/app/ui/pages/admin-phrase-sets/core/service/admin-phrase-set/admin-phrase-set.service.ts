import { API } from '@/core/config/api-uris.config';
import { PhraseSet } from '@/core/types/phrase-set.type';
import { Phrase } from '@/core/types/phrase.type';
import { Pagination } from '@/core/types/utils.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { keepPreviousData, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminPhraseSetService {
  private readonly client = inject(HttpClient);
  private readonly searchApi = API.ADMIN.PHRASE_SET.SEARCH;

  search(searchParam: string, { page, size }: Pagination) {
    return queryOptions({
      queryKey: ['phrase-set', searchParam, { page, size }],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ phraseSets: PhraseSet[]; total: number }>(this.searchApi, {
            params: {
              search: searchParam,
              page: page.toString(),
              size: size.toString(),
            },
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
}
