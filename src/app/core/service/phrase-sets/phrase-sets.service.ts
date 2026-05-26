import { API } from '@/core/config/api-uris.config';
import { PhraseSet } from '@/core/types/phrase-set.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { ContributorService } from '../contributor/contributor.service';

export type PhraseSetFilter = 'all' | 'incomplete' | 'completed' | 'untouched';
@Injectable({
  providedIn: 'root',
})
export class PhraseSetsService {
  private readonly contributorService = inject(ContributorService);

  private readonly phraseSetsApi = API.PHRASE_SETS.PAGINATED;
  private readonly client = inject(HttpClient);

  getPhraseSets(page: number, size: number) {
    return this.client
      .get<{ phraseSets: PhraseSet[] }>(this.phraseSetsApi, { params: { page, size } })
      .pipe(map((response) => response.phraseSets));
  }

  getFiltered(page: number, size: number, filter: PhraseSetFilter) {
    return this.contributorService.getProfile().pipe(
      map((contributor) => contributor.id),
      switchMap((contributorId) =>
        this.client.get<{ phraseSets: PhraseSet[] }>(this.phraseSetsApi, {
          params: { page, size, filter, contributorId },
        }),
      ),
      map((response) => response.phraseSets),
    );
  }
}
