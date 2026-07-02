import { AdminSummaryService } from '@/core/service/admin-summary/admin-summary.service';
import { type UserPhraseSetTranslationDetail } from '@/core/types/summary.type';
import { ZardPaginationComponent } from '@/shared/components/pagination';
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
import { AdminTranslationUserEntriesPanel } from './ui/organisms/admin-translation-user-entries-panel/admin-translation-user-entries-panel';
import { AdminTranslationUserContributionsTopBar } from './ui/organisms/admin-translation-user-contributions-top-bar/admin-translation-user-contributions-top-bar';
import { AdminTranslationUserSummaryPanel } from './ui/organisms/admin-translation-user-summary-panel/admin-translation-user-summary-panel';

@Component({
  selector: 'tm-admin-translation-user-contributions-page',
  imports: [
    AdminTranslationUserContributionsTopBar,
    AdminTranslationUserSummaryPanel,
    AdminTranslationUserEntriesPanel,
    ZardPaginationComponent,
  ],
  templateUrl: './admin-translation-user-contributions.page.html',
  styleUrl: './admin-translation-user-contributions.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationUserContributionsPage {
  readonly translationId = input.required<string>();
  readonly userId = input.required<string>();
  protected readonly pageParam = input('', { alias: 'page' });

  private readonly adminSummaryService = inject(AdminSummaryService);
  private readonly router = inject(Router);

  private readonly PAGE_SIZE = 10;

  protected readonly page = signal(1);

  protected readonly translationsQuery = injectQuery(() =>
    this.adminSummaryService.getPhraseSetUserTranslations(this.translationId(), this.userId(), {
      page: this.page(),
      size: this.PAGE_SIZE,
    }),
  );

  protected readonly detail = computed<UserPhraseSetTranslationDetail | null>(
    () => this.translationsQuery.data()?.data ?? null,
  );
  protected readonly summary = computed(() => this.detail()?.summary ?? null);
  protected readonly entries = computed(() => this.detail()?.entries ?? []);
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
