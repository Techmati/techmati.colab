import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { LanguageVariantService } from '@/core/service/language-variant/language-variant.service';
import type { LanguageVariant } from '@/core/types/language-variant.type';
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
  readonly search = input('');
  readonly showSelectedVariant = input(true);

  readonly selectedVariant = model<LanguageVariant | null>(null);

  private readonly variantService = inject(LanguageVariantService);

  protected readonly _search = linkedSignal(() => this.search());
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

  protected readonly trimmedSearch = computed(() => this._search().trim());

  readonly isSelected = computed(() => this.selectedVariant() !== null);

  constructor() {
    effect(() =>
      console.log('is focused', this.isFocused(), 'focused element: ', document.activeElement),
    );
    effect((onCleanup) => {
      const search = this._search().trim();
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

  async focus() {
    setTimeout(() => {
      this.searchInput()?.nativeElement.focus();
    }, 150);
  }

  clear(): void {
    this.selectedVariant.set(null);
  }

  protected onInput(value: string): void {
    this._search.set(value);
  }

  protected onFocus(): void {
    this.isFocused.set(true);
  }

  protected onBlur(): void {
    // Delay to allow click on a result before closing
    console.log('on blur', this.isFocused(), 'focused element: ', document.activeElement);
    setTimeout(() => {
      this.isFocused.set(false);
    }, 150);
  }

  protected select(variant: LanguageVariant): void {
    this.selectedVariant.set(variant);
    this._search.set('');
    this.debouncedSearch.set('');
    this.isFocused.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isFocused.set(false);
      this.searchInput()?.nativeElement.blur();
    }
  }
}
