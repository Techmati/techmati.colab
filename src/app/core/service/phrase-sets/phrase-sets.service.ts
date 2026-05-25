import { API } from '@/core/config/api-uris.config';
import { ContributorSummaryResponse } from '@/core/types/contributor-summary-response.type';
import { PhraseSet } from '@/core/types/phrase-set.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ContributorService } from '../contributor/contributor.service';

@Injectable({
  providedIn: 'root',
})
export class PhraseSetsService {
  private readonly contributorService = inject(ContributorService);

  private readonly phraseSetsApi = API.PHRASE_SETS.PAGINATED;
  private readonly summaryApi = API.PHRASE_SETS.SUMMARY;
  private readonly client = inject(HttpClient);

  getContributorSummary(contributorId: string) {
    const uri = this.summaryApi(contributorId);
    console.log({ uri });
    return this.client.get<ContributorSummaryResponse>(uri);
  }

  getPhraseSets(page: number, size: number) {
    return this.client
      .get<{ phraseSets: PhraseSet[] }>(this.phraseSetsApi, { params: { page, size } })
      .pipe(map((res) => res.phraseSets));
  }
}
