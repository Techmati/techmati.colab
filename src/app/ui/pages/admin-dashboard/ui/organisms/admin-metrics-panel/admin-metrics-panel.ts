import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { StatsService } from '../../../core/service/stats/stats.service';

@Component({
  selector: 'tm-admin-metrics-panel',
  imports: [ZardSkeletonComponent],
  templateUrl: './admin-metrics-panel.html',
  styleUrl: './admin-metrics-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMetricsPanel {
  private readonly statsService = inject(StatsService);

  readonly todayStats = injectQuery(() => this.statsService.getTodayStats());
}
