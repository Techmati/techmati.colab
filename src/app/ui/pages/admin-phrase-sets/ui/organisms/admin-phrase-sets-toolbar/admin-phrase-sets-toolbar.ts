import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { AdminPhraseSetService } from '../../../core/service/admin-phrase-set/admin-phrase-set.service';

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

  private readonly adminPhraseSetService = inject(AdminPhraseSetService);

  readonly page = signal(1);
  readonly size = 10;

  private readonly DEBOUNCE_DELAY = 750;

  readonly searchResults = injectQuery(() =>
    this.adminPhraseSetService.search(this.debouncedSearch(), {
      page: this.page(),
      size: this.size,
    }),
  );

  constructor() {
    effect(() => {
      this.search.set(this.searchParam() || '');
    });

    effect(() => {
      const search = this.debouncedSearch();
      this.router.navigate([], { queryParams: { search } });
    });

    effect((onCleanup) => {
      console.log(this.search());
      const search = this.search().trim();
      const timeoutId = setTimeout(() => {
        this.debouncedSearch.set(search);
      }, this.DEBOUNCE_DELAY);
      onCleanup(() => clearTimeout(timeoutId));
    });
  }
}
