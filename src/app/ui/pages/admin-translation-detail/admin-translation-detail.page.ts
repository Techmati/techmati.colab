import { AdminSummaryService } from '@/core/service/admin-summary/admin-summary.service';
import { type PhraseSet } from '@/core/types/phrase-set.type';
import { type SummaryFilter } from '@/core/types/summary.type';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { AdminTranslationContributorsFilterPanel } from './ui/organisms/admin-translation-contributors-filter-panel/admin-translation-contributors-filter-panel';
import { AdminTranslationContributorsListPanel } from './ui/organisms/admin-translation-contributors-list-panel/admin-translation-contributors-list-panel';
import { AdminTranslationDetailTopBar } from './ui/organisms/admin-translation-detail-top-bar/admin-translation-detail-top-bar';

@Component({
  selector: 'tm-admin-translation-detail-page',
  imports: [
    AdminTranslationDetailTopBar,
    AdminTranslationContributorsFilterPanel,
    AdminTranslationContributorsListPanel,
  ],
  templateUrl: './admin-translation-detail.page.html',
  styleUrl: './admin-translation-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationDetailPage {
  readonly translationId = input.required<string>();
  protected readonly searchParam = input('', { alias: 'search' });
  protected readonly pageParam = input('', { alias: 'page' });

  private readonly adminSummaryService = inject(AdminSummaryService);
  private readonly router = inject(Router);

  private readonly PAGE_SIZE = 10;
  private readonly SUMMARY_FILTER: SummaryFilter = 'all';

  protected readonly page = signal(1);

  protected readonly summariesQuery = injectQuery(() =>
    this.adminSummaryService.getPhraseSetSummaries(this.translationId(), {
      search: this.searchParam(),
      filter: this.SUMMARY_FILTER,
      includeContributor: true,
      includePhraseSet: true,
      page: this.page(),
      size: this.PAGE_SIZE,
    }),
  );

  protected readonly summaries = computed(() => this.summariesQuery.data()?.data ?? []);
  protected readonly total = computed(() => this.summariesQuery.data()?.total ?? 0);
  protected readonly phraseSet = computed<PhraseSet | null>(
    () => this.summaries().find((summary) => summary.phraseSet)?.phraseSet ?? null,
  );
  protected readonly pages = computed(() => Math.max(1, Math.ceil(this.total() / this.PAGE_SIZE)));
  protected readonly isLoading = computed(
    () => this.summariesQuery.isPending() || this.summariesQuery.isFetching(),
  );

  constructor() {
    effect(() => {
      this.page.set(this.normalizePage(this.pageParam()));
    });
  }

  protected selectPage(page: number): void {
    this.page.set(page);
    void this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  private normalizePage(value: string): number {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
  }
}
