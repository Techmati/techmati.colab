import { API } from '@/core/config/api-uris.config';
import { ContributorStats } from '@/core/types/contributor-stats.type';
import { FullSummary, SummaryFilter } from '@/core/types/summary.type';
import { Pagination } from '@/core/types/utils.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { keepPreviousData, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private readonly client = inject(HttpClient);

  private phraseSummaryApi = API.SUMMARY.PHRASE_SET;
  private filteredSummaryApi = API.SUMMARY.FILTERED;
  private statsApi = API.SUMMARY.STATS;
  private adminSummariesApi = API.ADMIN.SUMMARIES;

  getPhraseSumary(phraseId: string) {
    return this.client.get<FullSummary | null>(this.phraseSummaryApi(phraseId));
  }

  getFiltered({ page, size }: Pagination, filter: SummaryFilter) {
    return this.client.get<{ summaries: FullSummary[]; total: number }>(this.filteredSummaryApi, {
      params: {
        page,
        size,
        filter,
      },
    });
  }

  getStats() {
    return this.client.get<ContributorStats>(this.statsApi);
  }

  getAdminUserSummaries(userId: string, { page, size }: Pagination, filter: SummaryFilter) {
    return queryOptions({
      queryKey: ['users', userId, 'summaries', filter, { page, size }],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ data: FullSummary[]; total: number }>(this.adminSummariesApi(userId), {
            params: {
              filter,
              page: page.toString(),
              size: size.toString(),
            },
          }),
        ),
      placeholderData: keepPreviousData,
    });
  }
}
