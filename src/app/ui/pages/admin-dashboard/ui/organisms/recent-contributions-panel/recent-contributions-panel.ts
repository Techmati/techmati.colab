import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { StatsService } from '../../../core/service/stats/stats.service';
import { RecentContributionCard } from '../../molecules/recent-contribution-card/recent-contribution-card';

@Component({
  selector: 'tm-recent-contributions-panel',
  imports: [RecentContributionCard, ZardSkeletonComponent],
  templateUrl: './recent-contributions-panel.html',
  styleUrl: './recent-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentContributionsPanel {
  private readonly statsService = inject(StatsService);

  readonly latestContributions = injectQuery(() => this.statsService.getLatestContributions());

  readonly contributions = computed(
    () => this.latestContributions.data()?.latestContributions || [],
  );
}
