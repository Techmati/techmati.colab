import { API } from '@/core/config/api-uris.config';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { keepPreviousData, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { AdminUsersQuery } from '../dto/admin-users-query.dto';
import { AdminUsersSearchResponseDto } from '../dto/admin-users-search-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  private readonly client = inject(HttpClient);
  private readonly searchApi = API.ADMIN.USERS.SEARCH;

  search(query: AdminUsersQuery) {
    return queryOptions({
      queryKey: ['users', query],
      queryFn: () =>
        lastValueFrom(
          this.client.get<AdminUsersSearchResponseDto>(this.searchApi, {
            params: {
              search: query.search,
              role: query.role,
              status: query.status,
              page: query.page.toString(),
              size: query.size.toString(),
            },
          }),
        ),
      placeholderData: keepPreviousData,
    });
  }
}
