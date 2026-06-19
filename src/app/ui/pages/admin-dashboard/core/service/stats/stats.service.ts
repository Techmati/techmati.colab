import { API } from '@/core/config/api-uris.config';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LatestContributionsResponseDto } from '../../dto/latest-contributions-response.dto';
import { LatestUsersResponseDto } from '../../dto/latest-users-response.dto';
import { StatsResponseDto } from '../../dto/stats.response.dto';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private readonly client = inject(HttpClient);
  private readonly todayStatsApi = API.ADMIN.STATS.SUMMARY;
  private readonly latestContributionsApi = API.ADMIN.STATS.CONTRIBUTIONS.LATEST;
  private readonly latestUsersApi = API.ADMIN.STATS.USERS.LATEST;

  getTodayStats() {
    return this.client.get<StatsResponseDto>(this.todayStatsApi);
  }

  getLatestContributions() {
    return this.client.get<LatestContributionsResponseDto>(this.latestContributionsApi);
  }

  getLatestUsers() {
    return this.client.get<LatestUsersResponseDto>(this.latestUsersApi);
  }
}
