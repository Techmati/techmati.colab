import { API } from '@/core/config/api-uris.config';
import { ContributorSummaryResponse } from '@/core/types/contributor-summary-response.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContributorService } from '../contributor/contributor.service';

@Injectable({
  providedIn: 'root',
})
export class PhraseSetsService {
  private readonly contributorService = inject(ContributorService);

  private readonly summaryApi = API.PHRASE_SETS.SUMMARY;
  private readonly client = inject(HttpClient);

  getContributorSummary() {
    const sessionId = this.contributorService.getSessionId();
    if (!sessionId) throw new Error('User not logged in');
    const uri = this.summaryApi(sessionId);
    return this.client.get<ContributorSummaryResponse>(uri);
  }
}
