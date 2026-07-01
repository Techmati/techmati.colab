import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { type Profile } from '@/core/dto/profile.dto';
import { type UserContributionStats } from '@/core/types/contributor-stats.type';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';

@Component({
  selector: 'tm-admin-user-contribution-stats-panel',
  imports: [ZardSkeletonComponent],
  templateUrl: './admin-user-contribution-stats-panel.html',
  styleUrl: './admin-user-contribution-stats-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserContributionStatsPanel {
  readonly user = input<Profile | null>(null);
  readonly stats = input<UserContributionStats | null>(null);
  readonly isLoading = input.required<boolean>();

  protected readonly initials = computed(() => {
    const fullName = this.user()?.fullName ?? '';
    const parts = fullName.split(' ').filter((part) => part.length > 0);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';

    return `${first}${last}`.toUpperCase() || 'U';
  });
}
