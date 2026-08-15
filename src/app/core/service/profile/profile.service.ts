import { API } from '@/core/config/api-uris.config';
import { Profile, TechmatiRole, UpdateProfilePayload } from '@/core/dto/profile.dto';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mutationOptions, queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { GuestService } from '../guest/guest.service';

const COLLECTOR_ROLES: readonly TechmatiRole[] = ['collector', 'admin', 'root'];

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly client = inject(HttpClient);
  private readonly guestService = inject(GuestService);

  private readonly profileApi = API.PROFILE.GET;

  findCurrent() {
    return queryOptions({
      queryKey: ['profile', 'current'],
      enabled: !this.guestService.isGuest(),
      queryFn: () => lastValueFrom(this.client.get<Profile>(this.profileApi)),
    });
  }

  update() {
    return mutationOptions({
      mutationFn: (payload: UpdateProfilePayload) =>
        lastValueFrom(this.client.put<Profile>(API.PROFILE.UPDATE, payload)),
    });
  }

  delete() {
    return mutationOptions({
      mutationFn: () =>
        lastValueFrom(this.client.delete<{ message: string }>(API.PROFILE.DELETE)),
    });
  }

  canManageContributors(role: TechmatiRole | null | undefined): boolean {
    return role !== null && role !== undefined && COLLECTOR_ROLES.includes(role);
  }

  canAccessAdminPanel(role: TechmatiRole | null | undefined): boolean {
    return role !== null && role !== undefined && role !== 'user';
  }
}
