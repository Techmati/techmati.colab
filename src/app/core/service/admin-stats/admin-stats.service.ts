import { API } from '@/core/config/api-uris.config';
import { ContributorTranslationStats } from '@/core/types/contributor-stats.type';
import {
  LatestContributionDto,
  LatestUserDto,
  StatsOverview,
} from '@/core/types/stats.type';
import { Pagination } from '@/core/types/utils.type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { keepPreviousData, queryOptions } from '@tanstack/angular-query-experimental';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminStatsService {
  private readonly client = inject(HttpClient);

  overview(): Observable<StatsOverview> {
    return this.client.get<StatsOverview>(API.ADMIN.STATS.OVERVIEW);
  }

  searchOverview() {
    return queryOptions({
      queryKey: ['admin-stats', 'overview'],
      queryFn: () => lastValueFrom(this.overview()),
    });
  }

  latestContributions({ page, size }: Pagination): Observable<{ data: LatestContributionDto[]; total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.client.get<{ data: LatestContributionDto[]; total: number }>(
      API.ADMIN.STATS.LATEST_CONTRIBUTIONS,
      { params },
    );
  }

  searchLatestContributions({ page, size }: Pagination) {
    return queryOptions({
      queryKey: ['admin-stats', 'latest-contributions', page, size],
      queryFn: () => lastValueFrom(this.latestContributions({ page, size })),
      placeholderData: keepPreviousData,
    });
  }

  latestUsers({ page, size }: Pagination): Observable<{ data: LatestUserDto[]; total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.client.get<{ data: LatestUserDto[]; total: number }>(
      API.ADMIN.STATS.LATEST_USERS,
      { params },
    );
  }

  searchLatestUsers({ page, size }: Pagination) {
    return queryOptions({
      queryKey: ['admin-stats', 'latest-users', page, size],
      queryFn: () => lastValueFrom(this.latestUsers({ page, size })),
      placeholderData: keepPreviousData,
    });
  }

  contributorTranslations(contributorId: string): Observable<ContributorTranslationStats> {
    return this.client.get<ContributorTranslationStats>(
      API.ADMIN.STATS.CONTRIBUTOR_TRANSLATIONS(contributorId),
    );
  }

  searchContributorTranslations(contributorId: string) {
    return queryOptions({
      queryKey: ['admin-stats', 'contributor-translations', contributorId],
      queryFn: () => lastValueFrom(this.contributorTranslations(contributorId)),
    });
  }
}
