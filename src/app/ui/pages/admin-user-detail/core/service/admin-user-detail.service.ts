import { API } from '@/core/config/api-uris.config';
import { Profile, TechmatiRole } from '@/core/dto/profile.dto';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  mutationOptions,
  QueryClient,
  queryOptions,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminUserDetailService {
  private readonly client = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  findById(userId: string) {
    return queryOptions({
      queryKey: ['users', userId],
      queryFn: () => lastValueFrom(this.client.get<Profile>(API.ADMIN.USERS.BY_ID(userId))),
    });
  }

  assignRole(
    userId: string,
    onSuccessCallback?: () => void,
    onErrorCallback?: () => void,
  ) {
    return mutationOptions({
      mutationKey: ['users', userId, 'assign-role'],
      mutationFn: (role: TechmatiRole) =>
        lastValueFrom(this.client.put<Profile>(API.ADMIN.USERS.ASSIGN_ROLE(userId), { role })),
      onSuccess: async () => {
        await this.invalidateUserQueries(userId);
        onSuccessCallback?.();
      },
      onError: () => {
        onErrorCallback?.();
      },
    });
  }

  ban(userId: string, onSuccessCallback?: () => void, onErrorCallback?: () => void) {
    return mutationOptions({
      mutationKey: ['users', userId, 'ban'],
      mutationFn: () => lastValueFrom(this.client.post<Profile>(API.ADMIN.USERS.BAN(userId), null)),
      onSuccess: async () => {
        await this.invalidateUserQueries(userId);
        onSuccessCallback?.();
      },
      onError: () => {
        onErrorCallback?.();
      },
    });
  }

  unban(userId: string, onSuccessCallback?: () => void, onErrorCallback?: () => void) {
    return mutationOptions({
      mutationKey: ['users', userId, 'unban'],
      mutationFn: () =>
        lastValueFrom(this.client.post<Profile>(API.ADMIN.USERS.UNBAN(userId), null)),
      onSuccess: async () => {
        await this.invalidateUserQueries(userId);
        onSuccessCallback?.();
      },
      onError: () => {
        onErrorCallback?.();
      },
    });
  }

  private async invalidateUserQueries(userId: string): Promise<void> {
    await Promise.all([
      this.queryClient.invalidateQueries({ queryKey: ['users', userId] }),
      this.queryClient.invalidateQueries({ queryKey: ['users'] }),
    ]);
  }
}
