import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { FullSummary } from '@/core/types/summary.type';
import { AdminUserContributionCard } from '../../molecules/admin-user-contribution-card/admin-user-contribution-card';

@Component({
  selector: 'tm-admin-user-contributions-panel',
  imports: [AdminUserContributionCard, ZardButtonComponent, ZardEmptyComponent, ZardSkeletonComponent],
  templateUrl: './admin-user-contributions-panel.html',
  styleUrl: './admin-user-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserContributionsPanel {
  readonly contributions = input.required<readonly FullSummary[]>();
  readonly isLoading = input.required<boolean>();
  readonly total = input.required<number>();
}
