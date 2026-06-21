import { API } from '@/core/config/api-uris.config';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { LatestContributionsResponseDto } from '../../dto/latest-contributions-response.dto';
import { LatestUsersResponseDto } from '../../dto/latest-users-response.dto';
import { StatsResponseDto } from '../../dto/stats.response.dto';

//TODO: add pagination to the queries to retrieve the only 3 first as the component needs them
@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private readonly client = inject(HttpClient);

  private readonly todayStatsApi = API.ADMIN.STATS.SUMMARY;
  private readonly latestContributionsApi = API.ADMIN.STATS.CONTRIBUTIONS.LATEST;
  private readonly latestUsersApi = API.ADMIN.STATS.USERS.LATEST;

  getTodayStats() {
    return queryOptions({
      queryKey: ['stats', 'today'],
      queryFn: () => lastValueFrom(this.client.get<StatsResponseDto>(this.todayStatsApi)),
      staleTime: 0,
    });
  }

  getLatestContributions() {
    return queryOptions({
      queryKey: ['stats', 'latest-contributions'],
      queryFn: () =>
        lastValueFrom(this.client.get<LatestContributionsResponseDto>(this.latestContributionsApi)),
      staleTime: 0,
    });
  }

  getLatestUsers() {
    return queryOptions({
      queryKey: ['stats', 'latest-users'],
      queryFn: () => lastValueFrom(this.client.get<LatestUsersResponseDto>(this.latestUsersApi)),
      staleTime: 0,
    });
  }
}
