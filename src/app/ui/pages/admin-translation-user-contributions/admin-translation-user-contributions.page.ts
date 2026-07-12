import { AdminTranslationService } from '@/core/service/admin-translation/admin-translation.service';
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
  ],
  templateUrl: './admin-translation-user-contributions.page.html',
  styleUrl: './admin-translation-user-contributions.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationUserContributionsPage {
  readonly translationId = input.required<string>();
  readonly contributorId = input.required<string>();
  protected readonly pageParam = input('', { alias: 'page' });

  private readonly adminTranslationService = inject(AdminTranslationService);
  private readonly router = inject(Router);

  private readonly PAGE_SIZE = 10;

  protected readonly page = signal(1);

  protected readonly detailQuery = injectQuery(() =>
    this.adminTranslationService.searchContributorTranslationDetail(
      this.contributorId(),
      this.translationId(),
    ),
  );

  protected readonly summary = computed(() => this.detailQuery.data()?.translation ?? null);
  protected readonly entries = computed(() => this.detailQuery.data()?.entries ?? []);
  protected readonly isLoading = computed(
    () => this.detailQuery.isPending() || this.detailQuery.isFetching(),
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
