import { API } from '@/core/config/api-uris.config';
import { PhraseSet } from '@/core/types/phrase-set.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

export type PhraseSetFilter = 'all' | 'incomplete' | 'complete' | 'untouched';
@Injectable({
  providedIn: 'root',
})
export class PhraseSetsService {
  private readonly phraseSetsApi = API.PHRASE_SETS.PAGINATED;
  private readonly client = inject(HttpClient);

  getPhraseSets(page: number, size: number) {
    return this.client
      .get<{ phraseSets: PhraseSet[] }>(this.phraseSetsApi, { params: { page, size } })
      .pipe(map((response) => response.phraseSets));
  }

  getFiltered(page: number, size: number, filter: PhraseSetFilter) {
    return this.client.get<{ phraseSets: PhraseSet[] }>(this.phraseSetsApi, {
      params: { page, size, filter },
    });
  }
}
