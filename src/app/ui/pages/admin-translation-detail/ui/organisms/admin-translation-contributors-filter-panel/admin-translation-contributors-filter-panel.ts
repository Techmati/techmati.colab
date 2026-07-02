import { ZardInputDirective } from '@/shared/components/input';
import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'tm-admin-translation-contributors-filter-panel',
  imports: [FormsModule, ZardInputDirective, ZardInputGroupComponent],
  templateUrl: './admin-translation-contributors-filter-panel.html',
  styleUrl: './admin-translation-contributors-filter-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationContributorsFilterPanel {
  readonly searchParam = input('');

  protected readonly search = signal('');
  protected readonly debouncedSearch = signal('');

  private readonly router = inject(Router);
  private readonly DEBOUNCE_DELAY = 750;

  constructor() {
    effect(() => {
      this.search.set(this.searchParam() || '');
      this.debouncedSearch.set(this.searchParam() || '');
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

      void this.router.navigate([], {
        queryParams: { search: search || null, page: null },
        queryParamsHandling: 'merge',
      });
    });
  }
}
