import { API } from '@/core/config/api-uris.config';
import { ContributorStats } from '@/core/types/contributor-stats.type';
import { FullSummary, SummaryFilter } from '@/core/types/summary.type';
import { Pagination } from '@/core/types/utils.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { ContributorService } from '../contributor/contributor.service';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private readonly client = inject(HttpClient);
  private readonly contributorService = inject(ContributorService);

  private phraseSummaryApi = API.SUMMARY.PHRASE_SET;
  private filteredSummaryApi = API.SUMMARY.FILTERED;
  private statsApi = API.SUMMARY.STATS;

  getPhraseSumary(phraseId: string) {
    return this.contributorService.getProfile().pipe(
      map((contributor) => contributor.id),
      switchMap((contributorId) =>
        this.client.get<FullSummary | null>(this.phraseSummaryApi(contributorId, phraseId)),
      ),
    );
  }

  getFiltered({ page, size }: Pagination, filter: SummaryFilter) {
    return this.contributorService.getProfile().pipe(
      map((contributor) => contributor.id),
      switchMap((contributorId) =>
        this.client.get<{ summaries: FullSummary[]; total: number }>(this.filteredSummaryApi, {
          params: {
            page,
            size,
            filter,
            contributorId,
          },
        }),
      ),
    );
  }

  getStats() {
    return this.contributorService.getProfile().pipe(
      map((contributor) => contributor.id),
      switchMap((contributorId) =>
        this.client.get<ContributorStats>(API.SUMMARY.STATS(contributorId)),
      ),
    );
  }
}
