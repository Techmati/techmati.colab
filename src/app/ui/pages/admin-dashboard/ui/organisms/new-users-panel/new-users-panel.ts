import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { StatsService } from '../../../core/service/stats/stats.service';
import { AdminUserCard } from '../../molecules/admin-user-card/admin-user-card';

@Component({
  selector: 'tm-new-users-panel',
  imports: [AdminUserCard, ZardButtonComponent, ZardSkeletonComponent],
  templateUrl: './new-users-panel.html',
  styleUrl: './new-users-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewUsersPanel {
  private readonly statsService = inject(StatsService);

  readonly usersQuery = injectQuery(() => this.statsService.getLatestUsers());
  readonly users = computed(() => this.usersQuery.data()?.data || []);
}
