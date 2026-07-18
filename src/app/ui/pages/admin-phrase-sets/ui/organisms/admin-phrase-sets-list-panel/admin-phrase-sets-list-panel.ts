import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';

import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardPaginationComponent } from '@/shared/components/pagination';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { map } from 'rxjs';
import { AdminPhraseSetService } from '../../../../../../core/service/admin-phrase-set/admin-phrase-set.service';
import { AdminPhraseSetCard } from '../../molecules/admin-phrase-set-card/admin-phrase-set-card';

@Component({
  selector: 'tm-admin-phrase-sets-list-panel',
  imports: [AdminPhraseSetCard, ZardEmptyComponent, ZardSkeletonComponent, ZardPaginationComponent],
  templateUrl: './admin-phrase-sets-list-panel.html',
  styleUrl: './admin-phrase-sets-list-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetsListPanel {
  private readonly adminPhraseSetService = inject(AdminPhraseSetService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly page = signal(1);
  readonly size = 10;

  readonly searchResults = injectQuery(() =>
    this.adminPhraseSetService.search({
      search: this.searchParam() || '',
      category: this.categoryParam() || undefined,
      page: this.page(),
      size: this.size,
    }),
  );

  private readonly searchParam = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('search') || '')),
  );

  private readonly categoryParam = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('category') || 'all')),
  );

  private readonly pageParam = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('page') || '1')),
  );

  readonly pages = computed(() => Math.ceil((this.searchResults.data()?.total || 0) / this.size));

  readonly hasResults = computed(() => (this.searchResults.data()?.total ?? 0) > 0);

  constructor() {
    effect(() => {
      const page = Number(this.pageParam());
      if (Number.isInteger(page) && page > 0) {
        this.page.set(page);
      }
    });
  }

  protected selectPage(page: number): void {
    this.page.set(page);
    void this.router.navigate([], {
      queryParams: { page: page > 1 ? page : null },
      queryParamsHandling: 'merge',
    });
  }
}
