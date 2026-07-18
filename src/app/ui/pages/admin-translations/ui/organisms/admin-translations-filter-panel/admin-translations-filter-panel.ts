import { PHRASE_SET_CATEGORY_OPTIONS } from '@/core/config/phrase-set-category-labels.config';
import {
  type AdminPhraseSetSortBy,
  type AdminPhraseSetSortDirection,
} from '@/core/service/admin-phrase-set/admin-phrase-set.service';
import { ZardAccordionImports } from '@/shared/components/accordion';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { ZardSelectImports } from '@/shared/components/select';
import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type SortOptionValue = `${AdminPhraseSetSortBy}:${AdminPhraseSetSortDirection}`;

interface SortOption {
  readonly label: string;
  readonly value: SortOptionValue;
}

@Component({
  selector: 'tm-admin-translations-filter-panel',
  imports: [
    FormsModule,
    ZardButtonComponent,
    ZardInputDirective,
    ZardInputGroupComponent,
    ...ZardSelectImports,
    ...ZardAccordionImports,
  ],
  templateUrl: './admin-translations-filter-panel.html',
  styleUrl: './admin-translations-filter-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationsFilterPanel {
  readonly searchParam = input('');
  readonly categoryParam = input('all');
  readonly minContributorsParam = input('');
  readonly sortByParam = input('');
  readonly sortDirectionParam = input('');

  protected readonly search = signal('');
  protected readonly debouncedSearch = signal('');
  protected readonly category = signal('all');
  protected readonly minContributors = signal('');
  protected readonly sortOption = signal<SortOptionValue>('contributorsCount:desc');

  private readonly router = inject(Router);
  private readonly DEBOUNCE_DELAY = 750;

  protected readonly sortOptions: readonly SortOption[] = [
    { label: 'Más contribuciones', value: 'contributorsCount:desc' },
    { label: 'Menos contribuciones', value: 'contributorsCount:asc' },
    { label: 'Más frases', value: 'phraseCount:desc' },
    { label: 'Menos frases', value: 'phraseCount:asc' },
    { label: 'Título A-Z', value: 'title:asc' },
    { label: 'Más recientes', value: 'createdAt:desc' },
    { label: 'Categoría A-Z', value: 'category:asc' },
  ];

  protected readonly categoryOptions = [
    { label: 'Todas', value: 'all' },
    ...PHRASE_SET_CATEGORY_OPTIONS,
  ];

  constructor() {
    effect(() => {
      this.search.set(this.searchParam() || '');
      this.debouncedSearch.set(this.searchParam() || '');
    });

    effect(() => {
      this.category.set(this.categoryParam() || 'all');
    });

    effect(() => {
      this.minContributors.set(this.minContributorsParam() || '');
    });

    effect(() => {
      this.sortOption.set(this.toSortOption(this.sortByParam(), this.sortDirectionParam()));
    });

    effect((onCleanup) => {
      const search = this.search().trim();
      const timeoutId = setTimeout(() => {
        this.debouncedSearch.set(search);
      }, this.DEBOUNCE_DELAY);

      onCleanup(() => clearTimeout(timeoutId));
    });

    effect(() => {
      const search = this.debouncedSearch();
      if (search === (this.searchParam() || '').trim()) {
        return;
      }

      void this.navigateWithFilters({ search: search || null, page: null });
    });
  }

  protected selectCategory(value: string | string[]): void {
    const cat = typeof value === 'string' ? value : 'all';
    this.category.set(cat);
    void this.navigateWithFilters({
      category: cat === 'all' ? null : cat,
      page: null,
    });
  }

  protected selectSort(value: string | string[]): void {
    if (typeof value !== 'string' || !this.isSortOption(value)) {
      return;
    }

    this.sortOption.set(value);
    const [sortBy, sortDirection] = value.split(':') as [
      AdminPhraseSetSortBy,
      AdminPhraseSetSortDirection,
    ];

    void this.navigateWithFilters({ sortBy, sortDirection, page: null });
  }

  protected updateMinContributors(value: string): void {
    this.minContributors.set(value);
    const minContributors = this.normalizeMinContributors(value);

    void this.navigateWithFilters({
      minContributors: minContributors === null ? null : minContributors,
      page: null,
    });
  }

  protected clearFilters(): void {
    this.search.set('');
    this.debouncedSearch.set('');
    this.category.set('all');
    this.minContributors.set('');
    this.sortOption.set('contributorsCount:desc');

    void this.router.navigate([], {
      queryParams: {
        search: null,
        category: null,
        minContributors: null,
        sortBy: null,
        sortDirection: null,
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  private navigateWithFilters(
    queryParams: Record<string, string | number | null>,
  ): Promise<boolean> {
    return this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private normalizeMinContributors(value: string): number | null {
    const minContributors = Number(value);
    return Number.isInteger(minContributors) && minContributors > 0 ? minContributors : null;
  }

  private toSortOption(sortBy: string, sortDirection: string): SortOptionValue {
    const value = `${sortBy}:${sortDirection}`;
    return this.isSortOption(value) ? value : 'contributorsCount:desc';
  }

  private isSortOption(value: string): value is SortOptionValue {
    return this.sortOptions.some((option) => option.value === value);
  }
}
