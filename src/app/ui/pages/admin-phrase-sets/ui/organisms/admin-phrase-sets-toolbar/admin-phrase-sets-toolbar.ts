import { PHRASE_SET_CATEGORY_OPTIONS } from '@/core/config/phrase-set-category-labels.config';
import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { ZardSelectImports } from '@/shared/components/select';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'tm-admin-phrase-sets-toolbar',
  imports: [
    ...ZardAccordionImports,
    ZardButtonComponent,
    ZardInputDirective,
    ZardInputGroupComponent,
    ...ZardSelectImports,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './admin-phrase-sets-toolbar.html',
  styleUrl: './admin-phrase-sets-toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetsToolbar {
  readonly searchParam = input.required<string>();
  readonly categoryParam = input('all', { alias: 'category' });
  readonly search = signal('');
  readonly debouncedSearch = signal('');
  readonly category = signal('all');
  private readonly router = inject(Router);

  protected readonly categoryOptions = [
    { label: 'Todas', value: 'all' },
    ...PHRASE_SET_CATEGORY_OPTIONS,
  ];

  private readonly DEBOUNCE_DELAY = 750;

  constructor() {
    effect(() => {
      this.search.set(this.searchParam() || '');
    });

    effect(() => {
      this.category.set(this.categoryParam() || 'all');
    });

    effect(() => {
      const search = this.debouncedSearch();
      this.router.navigate([], { queryParams: { search } });
    });

    effect((onCleanup) => {
      const search = this.search().trim();
      const timeoutId = setTimeout(() => {
        this.debouncedSearch.set(search);
      }, this.DEBOUNCE_DELAY);
      onCleanup(() => clearTimeout(timeoutId));
    });
  }

  protected selectCategory(value: string | string[]): void {
    const cat = typeof value === 'string' ? value : 'all';
    this.category.set(cat);
    this.router.navigate([], {
      queryParams: { category: cat === 'all' ? null : cat },
      queryParamsHandling: 'merge',
    });
  }

  protected clearFilters(): void {
    this.search.set('');
    this.debouncedSearch.set('');
    this.category.set('all');

    void this.router.navigate([], {
      queryParams: {
        search: null,
        category: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
