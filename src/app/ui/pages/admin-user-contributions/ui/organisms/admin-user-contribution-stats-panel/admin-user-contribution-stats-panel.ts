import { type ContributorTranslationStats } from '@/core/types/contributor-stats.type';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tm-admin-user-contribution-stats-panel',
  imports: [ZardSkeletonComponent],
  templateUrl: './admin-user-contribution-stats-panel.html',
  styleUrl: './admin-user-contribution-stats-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserContributionStatsPanel {
  readonly stats = input<ContributorTranslationStats | null>(null);
  readonly isLoading = input.required<boolean>();
}
