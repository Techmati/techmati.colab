import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'tm-admin-phrase-sets-toolbar',
  imports: [ZardButtonComponent, ZardInputDirective, ZardInputGroupComponent, FormsModule],
  templateUrl: './admin-phrase-sets-toolbar.html',
  styleUrl: './admin-phrase-sets-toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetsToolbar {
  readonly searchParam = input.required<string>();
  readonly search = signal('');
  readonly debouncedSearch = signal('');
  private readonly router = inject(Router);

  private readonly DEBOUNCE_DELAY = 750;

  constructor() {
    effect(() => {
      this.search.set(this.searchParam() || '');
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
}
