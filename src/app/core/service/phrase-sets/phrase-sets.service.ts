import { API } from '@/core/config/api-uris.config';
import {
  ContributorSummaryResponse,
  PhraseSetsInProgress,
} from '@/core/types/contributor-summary-response.type';
import { PhraseSet } from '@/core/types/phrase-set.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { ContributorService } from '../contributor/contributor.service';

@Injectable({
  providedIn: 'root',
})
export class PhraseSetsService {
  private readonly contributorService = inject(ContributorService);

  private readonly phraseSetsApi = API.PHRASE_SETS.PAGINATED;
  private readonly contributorSummaryApi = API.PHRASE_SETS.CONTRIBUTOR_SUMMARY;
  private readonly phraseSetSummaryApi = API.PHRASE_SETS.SUMMARY;
  private readonly client = inject(HttpClient);

  getContributorSummary() {
    return this.contributorService.getProfile(this.contributorService.sessionId()).pipe(
      map((profile) => this.contributorSummaryApi(profile.id)),
      switchMap((uri) => this.client.get<ContributorSummaryResponse>(uri)),
    );
  }

  getPhraseSetSummaryByPhraseSetId(phraseSetId: string): Observable<PhraseSetsInProgress> {
    return this.contributorService.getProfile(this.contributorService.sessionId()).pipe(
      map((profile) => ({ contributorId: profile.id })),
      switchMap(({ contributorId }) =>
        this.client.get<PhraseSetsInProgress>(this.phraseSetSummaryApi(phraseSetId, contributorId)),
      ),
    );
  }

  getPhraseSets(page: number, size: number) {
    return this.client
      .get<{ phraseSets: PhraseSet[] }>(this.phraseSetsApi, { params: { page, size } })
      .pipe(map((res) => res.phraseSets));
  }
}
