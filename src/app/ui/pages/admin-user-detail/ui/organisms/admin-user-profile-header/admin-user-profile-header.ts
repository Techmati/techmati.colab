import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { type Profile } from '@/core/dto/profile.dto';

@Component({
  selector: 'tm-admin-user-profile-header',
  imports: [],
  templateUrl: './admin-user-profile-header.html',
  styleUrl: './admin-user-profile-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserProfileHeader {
  readonly user = input.required<Profile>();

  protected readonly displayName = computed(() => {
    const fullName = this.user().fullName?.trim();
    return fullName || this.user().username || 'No proporcionado';
  });

  protected readonly initials = computed(() => {
    const parts = this.displayName().split(' ').filter((part) => part.length > 0);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';

    return `${first}${last}`.toUpperCase() || '??';
  });
}
