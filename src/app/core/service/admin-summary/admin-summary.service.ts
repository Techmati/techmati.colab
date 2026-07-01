import { API } from '@/core/config/api-uris.config';
import {
  SummaryFilter,
  UserPhraseSetContributionSummary,
} from '@/core/types/summary.type';
import { Pagination } from '@/core/types/utils.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { keepPreviousData, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

interface AdminUserSummariesOptions extends Pagination {
  readonly filter: SummaryFilter;
  readonly includeEntries?: boolean;
  readonly entriesLimit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminSummaryService {
  private readonly client = inject(HttpClient);
  private readonly userSummariesApi = API.ADMIN.SUMMARIES;

  getUserSummaries(
    userId: string,
    {
      page,
      size,
      filter,
      includeEntries = false,
      entriesLimit = 0,
    }: AdminUserSummariesOptions,
  ) {
    return queryOptions({
      queryKey: [
        'admin-summaries',
        'users',
        userId,
        { page, size, filter, includeEntries, entriesLimit },
      ],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ data: UserPhraseSetContributionSummary[]; total: number }>(
            this.userSummariesApi(userId),
            {
              params: {
                includeEntries: includeEntries.toString(),
                entriesLimit: entriesLimit.toString(),
                page: page.toString(),
                size: size.toString(),
                filter,
              },
            },
          ),
        ),
      placeholderData: keepPreviousData,
    });
  }
}
