import { AdminSummaryService } from '@/core/service/admin-summary/admin-summary.service';
import { type SummaryFilter } from '@/core/types/summary.type';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardPaginationComponent } from '@/shared/components/pagination';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { AdminUserDetailService } from '../admin-user-detail/core/service/admin-user-detail.service';
import { AdminUserContributionPhraseSetPanel } from './ui/organisms/admin-user-contribution-phrase-set-panel/admin-user-contribution-phrase-set-panel';
import { AdminUserContributionStatsPanel } from './ui/organisms/admin-user-contribution-stats-panel/admin-user-contribution-stats-panel';
import { AdminUserContributionsTopBar } from './ui/organisms/admin-user-contributions-top-bar/admin-user-contributions-top-bar';

@Component({
  selector: 'tm-admin-user-contributions-page',
  imports: [
    AdminUserContributionsTopBar,
    AdminUserContributionStatsPanel,
    AdminUserContributionPhraseSetPanel,
    ZardEmptyComponent,
    ZardPaginationComponent,
    ZardSkeletonComponent,
  ],
  templateUrl: './admin-user-contributions.page.html',
  styleUrl: './admin-user-contributions.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserContributionsPage {
  readonly userId = input.required<string>();
  protected readonly pageParam = input('', { alias: 'page' });

  private readonly adminUserDetailService = inject(AdminUserDetailService);
  private readonly adminSummaryService = inject(AdminSummaryService);
  private readonly router = inject(Router);

  private readonly SUMMARY_FILTER: SummaryFilter = 'all';
  private readonly PAGE_SIZE = 10;
  private readonly ENTRIES_LIMIT = 3;

  protected readonly page = signal(1);

  protected readonly userQuery = injectQuery(() =>
    this.adminUserDetailService.findById(this.userId()),
  );

  protected readonly statsQuery = injectQuery(() =>
    this.adminSummaryService.getUserContributionStats(this.userId()),
  );

  protected readonly summariesQuery = injectQuery(() =>
    this.adminSummaryService.getUserSummaries(this.userId(), {
      page: this.page(),
      size: this.PAGE_SIZE,
      filter: this.SUMMARY_FILTER,
      includeEntries: true,
      entriesLimit: this.ENTRIES_LIMIT,
    }),
  );

  protected readonly user = computed(() => this.userQuery.data() ?? null);
  protected readonly stats = computed(() => this.statsQuery.data() ?? null);
  protected readonly summaries = computed(() => this.summariesQuery.data()?.data ?? []);
  protected readonly summariesTotal = computed(() => this.summariesQuery.data()?.total ?? 0);
  protected readonly pages = computed(() =>
    Math.max(1, Math.ceil(this.summariesTotal() / this.PAGE_SIZE)),
  );
  protected readonly isStatsLoading = computed(
    () => this.userQuery.isPending() || this.statsQuery.isPending(),
  );
  protected readonly isSummariesLoading = computed(
    () => this.summariesQuery.isPending() || this.summariesQuery.isFetching(),
  );

  constructor() {
    effect(() => {
      this.page.set(this.normalizePage(this.pageParam()));
    });
  }

  protected selectPage(page: number): void {
    this.page.set(page);
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  private normalizePage(value: string): number {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
  }
}
