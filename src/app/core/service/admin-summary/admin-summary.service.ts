import { API } from '@/core/config/api-uris.config';
import { UserContributionStats } from '@/core/types/contributor-stats.type';
import {
  PhraseSetContributorSummary,
  SummaryFilter,
  UserPhraseSetContributionSummary,
  UserPhraseSetTranslationDetail,
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

interface AdminPhraseSetSummariesOptions extends Pagination {
  readonly search?: string;
  readonly filter: SummaryFilter;
  readonly includeContributor?: boolean;
  readonly includePhraseSet?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminSummaryService {
  private readonly client = inject(HttpClient);
  private readonly userSummariesApi = API.ADMIN.SUMMARIES.USER;
  private readonly phraseSetSummariesApi = API.ADMIN.SUMMARIES.PHRASE_SET;
  private readonly phraseSetUserTranslationsApi = API.ADMIN.SUMMARIES.PHRASE_SET_USER_TRANSLATIONS;
  private readonly userStatsApi = API.ADMIN.STATS.USER;

  getUserSummaries(
    userId: string,
    { page, size, filter, includeEntries = false, entriesLimit = 0 }: AdminUserSummariesOptions,
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

  getPhraseSetSummaries(
    phraseSetId: string,
    {
      page,
      size,
      search = '',
      filter,
      includeContributor = false,
      includePhraseSet = false,
    }: AdminPhraseSetSummariesOptions,
  ) {
    return queryOptions({
      queryKey: [
        'admin-summaries',
        'phrase-sets',
        phraseSetId,
        { page, size, search, filter, includeContributor, includePhraseSet },
      ],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ data: PhraseSetContributorSummary[]; total: number }>(
            this.phraseSetSummariesApi(phraseSetId),
            {
              params: {
                ...(search.trim() ? { search: search.trim() } : {}),
                filter,
                includeContributor: includeContributor.toString(),
                includePhraseSet: includePhraseSet.toString(),
                page: page.toString(),
                size: size.toString(),
              },
            },
          ),
        ),
      placeholderData: keepPreviousData,
    });
  }

  getPhraseSetUserTranslations(phraseSetId: string, userId: string, { page, size }: Pagination) {
    return queryOptions({
      queryKey: [
        'admin-summaries',
        'phrase-sets',
        phraseSetId,
        'users',
        userId,
        'translations',
        { page, size },
      ],
      queryFn: () =>
        lastValueFrom(
          this.client.get<{ data: UserPhraseSetTranslationDetail; total: number }>(
            this.phraseSetUserTranslationsApi(phraseSetId, userId),
            {
              params: {
                page: page.toString(),
                size: size.toString(),
              },
            },
          ),
        ),
      placeholderData: keepPreviousData,
    });
  }

  getUserContributionStats(userId: string) {
    return queryOptions({
      queryKey: ['admin-summaries', 'users', userId, 'stats'],
      queryFn: () =>
        lastValueFrom(this.client.get<UserContributionStats>(this.userStatsApi(userId))),
    });
  }
}
