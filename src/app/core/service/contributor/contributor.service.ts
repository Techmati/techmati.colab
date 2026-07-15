import { API } from '@/core/config/api-uris.config';
import { Contributor } from '@/core/types/contributor.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mutationOptions, QueryClient, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map, Observable } from 'rxjs';

export interface CreateContributorPayload {
  fullName: string;
  variantIds: string[];
}

export interface UpdateContributorPayload {
  id: string;
  fullName?: string;
  variantIds?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ContributorService {
  private readonly client = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  listObservable(): Observable<Contributor[]> {
    return this.client
      .get<{ data: Contributor[] }>(API.CONTRIBUTORS.LIST)
      .pipe(map((response) => response.data));
  }

  list() {
    return queryOptions({
      queryKey: ['contributors'],
      queryFn: () =>
        lastValueFrom(
          this.client
            .get<{ data: Contributor[] }>(API.CONTRIBUTORS.LIST)
            .pipe(map((response) => response.data)),
        ),
    });
  }

  findById(id: string): Observable<Contributor> {
    return this.client.get<Contributor>(API.CONTRIBUTORS.BY_ID(id));
  }

  create() {
    return mutationOptions({
      mutationFn: (payload: CreateContributorPayload) =>
        lastValueFrom(this.client.post<Contributor>(API.CONTRIBUTORS.LIST, payload)),
    });
  }

  update() {
    return mutationOptions({
      mutationFn: (payload: UpdateContributorPayload) =>
        lastValueFrom(this.client.put<Contributor>(API.CONTRIBUTORS.BY_ID(payload.id), payload)),
    });
  }

  delete() {
    return mutationOptions({
      mutationFn: (id: string) =>
        lastValueFrom(this.client.delete<{ message: string }>(API.CONTRIBUTORS.BY_ID(id))),
    });
  }

  invalidateContributorsList() {
    this.queryClient.invalidateQueries({ queryKey: ['contributors'] });
  }
}
