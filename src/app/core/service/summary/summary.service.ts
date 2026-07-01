import { API } from '@/core/config/api-uris.config';
import { ContributorStats } from '@/core/types/contributor-stats.type';
import { PhraseSetSummary, SummaryFilter } from '@/core/types/summary.type';
import { Pagination } from '@/core/types/utils.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private readonly client = inject(HttpClient);

  private phraseSummaryApi = API.SUMMARY.PHRASE_SET;
  private filteredSummaryApi = API.SUMMARY.FILTERED;
  private statsApi = API.SUMMARY.STATS;

  getPhraseSumary(phraseId: string) {
    return this.client.get<PhraseSetSummary | null>(this.phraseSummaryApi(phraseId));
  }

  getFiltered({ page, size }: Pagination, filter: SummaryFilter) {
    return this.client.get<{ summaries: PhraseSetSummary[]; total: number }>(
      this.filteredSummaryApi,
      {
        params: {
          page,
          size,
          filter,
        },
      },
    );
  }

  getStats() {
    return this.client.get<ContributorStats>(this.statsApi);
  }
}
