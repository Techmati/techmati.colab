import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { injectQuery } from '@tanstack/angular-query-experimental';

import type { LanguageVariant } from '@/core/types/language-variant.type';
import { LanguageVariantService } from '@/core/service/language-variant/language-variant.service';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';

@Component({
  selector: 'tm-variant-search-input',
  imports: [FormsModule, ZardSkeletonComponent],
  templateUrl: './variant-search-input.html',
  styleUrl: './variant-search-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariantSearchInput {
  readonly disabled = input(false);
  readonly selectedVariant = model<LanguageVariant | null>(null);

  private readonly variantService = inject(LanguageVariantService);

  protected readonly search = signal('');
  protected readonly debouncedSearch = signal('');
  protected readonly isFocused = signal(false);

  protected readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  private readonly DEBOUNCE_DELAY = 300;

  protected readonly resultsQuery = injectQuery(() => {
    const query = this.debouncedSearch();
    return {
      ...this.variantService.search({
        search: query,
        includeFamily: true,
        size: 20,
      }),
      enabled: query.length > 0,
    };
  });

  protected readonly results = computed(() => this.resultsQuery.data()?.data ?? []);

  readonly showDropdown = computed(
    () => this.isFocused() && this.debouncedSearch().length > 0 && !this.resultsQuery.isPending(),
  );

  readonly isSelected = computed(() => this.selectedVariant() !== null);

  constructor() {
    effect((onCleanup) => {
      const search = this.search().trim();
      if (search.length === 0) {
        this.debouncedSearch.set('');
        return;
      }
      const timeoutId = setTimeout(() => {
        this.debouncedSearch.set(search);
      }, this.DEBOUNCE_DELAY);
      onCleanup(() => clearTimeout(timeoutId));
    });
  }

  protected onInput(value: string): void {
    this.search.set(value);
  }

  protected onFocus(): void {
    this.isFocused.set(true);
  }

  protected onBlur(): void {
    // Delay to allow click on a result before closing
    setTimeout(() => {
      this.isFocused.set(false);
    }, 150);
  }

  protected select(variant: LanguageVariant): void {
    this.selectedVariant.set(variant);
    this.search.set('');
    this.debouncedSearch.set('');
    this.isFocused.set(false);
  }

  protected clear(): void {
    this.selectedVariant.set(null);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isFocused.set(false);
      this.searchInput()?.nativeElement.blur();
    }
  }
}
