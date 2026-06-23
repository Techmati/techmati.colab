import { API } from '@/core/config/api-uris.config';
import { Profile } from '@/core/dto/Profile.dto';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom, map } from 'rxjs';

type ProfileResponse = Profile | { profile: Profile };

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly client = inject(HttpClient);
  private readonly profileApi = API.PROFILE.GET;

  findCurrent() {
    return queryOptions({
      queryKey: ['profile', 'current'],
      queryFn: () =>
        lastValueFrom(
          this.client
            .get<ProfileResponse>(this.profileApi)
            .pipe(map((response) => ('profile' in response ? response.profile : response))),
        ),
    });
  }
}
