import { AdminStatsService } from '@/core/service/admin-stats/admin-stats.service';
import { AdminTranslationService } from '@/core/service/admin-translation/admin-translation.service';
import { TranslationFilter } from '@/core/types/translation.type';
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
  readonly contributorId = input.required<string>();
  protected readonly pageParam = input('', { alias: 'page' });

  private readonly adminTranslationService = inject(AdminTranslationService);
  private readonly adminStatsService = inject(AdminStatsService);
  private readonly router = inject(Router);

  private readonly TRANSLATION_FILTER: TranslationFilter = 'all';
  private readonly PAGE_SIZE = 10;

  protected readonly page = signal(1);

  protected readonly statsQuery = injectQuery(() =>
    this.adminStatsService.contributorTranslations(this.contributorId()),
  );

  protected readonly translationsQuery = injectQuery(() =>
    this.adminTranslationService.listByContributor(this.contributorId(), {
      page: this.page(),
      size: this.PAGE_SIZE,
      filter: this.TRANSLATION_FILTER,
      include_phrase_set: true,
    }),
  );

  protected readonly stats = computed(() => this.statsQuery.data() ?? null);
  protected readonly translations = computed(() => this.translationsQuery.data()?.data ?? []);
  protected readonly total = computed(() => this.translationsQuery.data()?.total ?? 0);
  protected readonly pages = computed(() => Math.max(1, Math.ceil(this.total() / this.PAGE_SIZE)));
  protected readonly isStatsLoading = computed(() => this.statsQuery.isPending());
  protected readonly isTranslationsLoading = computed(
    () => this.translationsQuery.isPending() || this.translationsQuery.isFetching(),
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
