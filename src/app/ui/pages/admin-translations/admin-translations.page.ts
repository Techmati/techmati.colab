import {
  type AdminPhraseSetSearchQuery,
  type AdminPhraseSetSortBy,
  type AdminPhraseSetSortDirection,
} from '@/core/service/admin-phrase-set/admin-phrase-set.service';
import { PHRASE_SET_CATEGORIES } from '@/core/config/phrase-set-category-labels.config';
import { AdminBottomNav } from '@/ui/organisms/admin-bottom-nav/admin-bottom-nav';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AdminTranslationsFilterPanel } from './ui/organisms/admin-translations-filter-panel/admin-translations-filter-panel';
import { AdminTranslationsListPanel } from './ui/organisms/admin-translations-list-panel/admin-translations-list-panel';

const SORT_BY_VALUES = [
  'createdAt',
  'title',
  'phraseCount',
  'contributorsCount',
  'category',
] as const satisfies readonly AdminPhraseSetSortBy[];

const SORT_DIRECTION_VALUES = [
  'asc',
  'desc',
] as const satisfies readonly AdminPhraseSetSortDirection[];

@Component({
  selector: 'tm-admin-translations-page',
  imports: [TopAppBar, AdminTranslationsFilterPanel, AdminTranslationsListPanel, AdminBottomNav],
  templateUrl: './admin-translations.page.html',
  styleUrl: './admin-translations.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationsPage {
  protected readonly searchParam = input('', { alias: 'search' });
  protected readonly categoryParam = input('all', { alias: 'category' });
  protected readonly minContributorsParam = input('', { alias: 'minContributors' });
  protected readonly sortByParam = input('', { alias: 'sortBy' });
  protected readonly sortDirectionParam = input('', { alias: 'sortDirection' });
  protected readonly pageParam = input('', { alias: 'page' });

  private readonly PAGE_SIZE = 10;

  protected readonly query = computed<AdminPhraseSetSearchQuery>(() => ({
    search: (this.searchParam() || '').trim(),
    category: this.normalizeCategory(this.categoryParam()),
    includeStats: true,
    minContributors: this.normalizeMinContributors(this.minContributorsParam()),
    sortBy: this.normalizeSortBy(this.sortByParam()),
    sortDirection: this.normalizeSortDirection(this.sortDirectionParam()),
    page: this.normalizePage(this.pageParam()),
    size: this.PAGE_SIZE,
  }));

  private normalizeCategory(value: string): string {
    return (PHRASE_SET_CATEGORIES as readonly string[]).includes(value) ? value : 'all';
  }

  private normalizePage(value: string): number {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
  }

  private normalizeMinContributors(value: string): number | null {
    const minContributors = Number(value);
    return Number.isInteger(minContributors) && minContributors > 0 ? minContributors : null;
  }

  private normalizeSortBy(value: string): AdminPhraseSetSortBy {
    return (SORT_BY_VALUES as readonly string[]).includes(value)
      ? (value as AdminPhraseSetSortBy)
      : 'contributorsCount';
  }

  private normalizeSortDirection(value: string): AdminPhraseSetSortDirection {
    return (SORT_DIRECTION_VALUES as readonly string[]).includes(value)
      ? (value as AdminPhraseSetSortDirection)
      : 'desc';
  }
}
