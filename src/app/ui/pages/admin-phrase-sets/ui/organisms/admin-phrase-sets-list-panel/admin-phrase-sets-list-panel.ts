import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ZardPaginationComponent } from '@/shared/components/pagination';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { map } from 'rxjs';
import { AdminPhraseSetService } from '../../../../../../core/service/admin-phrase-set/admin-phrase-set.service';
import { AdminPhraseSetCard } from '../../molecules/admin-phrase-set-card/admin-phrase-set-card';

@Component({
  selector: 'tm-admin-phrase-sets-list-panel',
  imports: [AdminPhraseSetCard, ZardSkeletonComponent, ZardPaginationComponent],
  templateUrl: './admin-phrase-sets-list-panel.html',
  styleUrl: './admin-phrase-sets-list-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetsListPanel {
  private readonly adminPhraseSetService = inject(AdminPhraseSetService);
  readonly page = signal(1);
  readonly size = 10;

  readonly searchResults = injectQuery(() =>
    this.adminPhraseSetService.search({
      search: this.searchParam() || '',
      page: this.page(),
      size: this.size,
    }),
  );
  private readonly route = inject(ActivatedRoute);

  private readonly searchParam = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('search') || '')),
  );

  readonly pages = computed(() => Math.ceil((this.searchResults.data()?.total || 0) / this.size));
}
