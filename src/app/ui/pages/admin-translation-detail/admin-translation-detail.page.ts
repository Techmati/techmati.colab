import { AdminPhraseSetService } from '@/core/service/admin-phrase-set/admin-phrase-set.service';
import { AdminTranslationService } from '@/core/service/admin-translation/admin-translation.service';
import { PhraseSet } from '@/core/types/phrase-set.type';
import { AdminTranslationListItem } from '@/core/types/translation.type';
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
  readonly phraseSetId = input.required<string>();
  protected readonly searchParam = input('', { alias: 'search' });
  protected readonly pageParam = input('', { alias: 'page' });

  private readonly adminTranslationService = inject(AdminTranslationService);
  private readonly adminPhraseSetService = inject(AdminPhraseSetService);
  private readonly router = inject(Router);

  private readonly PAGE_SIZE = 10;

  protected readonly page = signal(1);

  protected readonly phraseSetQuery = injectQuery(() =>
    this.adminPhraseSetService.findByIdQuery(this.phraseSetId()),
  );

  protected readonly translationsQuery = injectQuery(() =>
    this.adminTranslationService.searchListByPhraseSet(this.phraseSetId(), {
      page: this.page(),
      size: this.PAGE_SIZE,
      search: this.searchParam() || undefined,
    }),
  );

  protected readonly phraseSet = computed<PhraseSet | null>(
    () => this.phraseSetQuery.data() ?? null,
  );

  protected readonly translations = computed<AdminTranslationListItem[]>(
    () => this.translationsQuery.data()?.data ?? [],
  );
  protected readonly total = computed(() => this.translationsQuery.data()?.total ?? 0);
  protected readonly pages = computed(() => Math.max(1, Math.ceil(this.total() / this.PAGE_SIZE)));
  protected readonly isLoading = computed(
    () => this.translationsQuery.isPending() || this.translationsQuery.isFetching(),
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
