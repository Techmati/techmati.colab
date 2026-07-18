import { API } from '@/core/config/api-uris.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { LatestContributionsResponseDto } from '../../dto/latest-contributions-response.dto';
import { LatestUsersResponseDto } from '../../dto/latest-users-response.dto';
import { StatsResponseDto } from '../../dto/stats.response.dto';

// TODO: merge with core AdminStatsService and consolidate DTOs (core and page-local duplicate the same endpoints)
@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private readonly client = inject(HttpClient);

  private readonly overviewApi = API.ADMIN.STATS.OVERVIEW;
  private readonly latestContributionsApi = API.ADMIN.STATS.LATEST_CONTRIBUTIONS;
  private readonly latestUsersApi = API.ADMIN.STATS.LATEST_USERS;

  getTodayStats() {
    return queryOptions({
      queryKey: ['stats', 'today'],
      queryFn: () => lastValueFrom(this.client.get<StatsResponseDto>(this.overviewApi)),
      staleTime: 0,
    });
  }

  getLatestContributions(page = 1, size = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return queryOptions({
      queryKey: ['stats', 'latest-contributions', page, size],
      queryFn: () =>
        lastValueFrom(
          this.client.get<LatestContributionsResponseDto>(
            this.latestContributionsApi,
            { params },
          ),
        ),
      staleTime: 0,
    });
  }

  getLatestUsers(page = 1, size = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return queryOptions({
      queryKey: ['stats', 'latest-users', page, size],
      queryFn: () =>
        lastValueFrom(
          this.client.get<LatestUsersResponseDto>(this.latestUsersApi, { params }),
        ),
      staleTime: 0,
    });
  }
}
