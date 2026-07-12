import {
  AdminPhraseSetSearchQuery,
  AdminPhraseSetService,
} from '@/core/service/admin-phrase-set/admin-phrase-set.service';
import { type PhraseSetWithStats } from '@/core/types/phrase-set.type';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardPaginationComponent } from '@/shared/components/pagination';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { AdminTranslationPhraseSetCard } from '../../molecules/admin-translation-phrase-set-card/admin-translation-phrase-set-card';

@Component({
  selector: 'tm-admin-translations-list-panel',
  imports: [
    AdminTranslationPhraseSetCard,
    ZardEmptyComponent,
    ZardPaginationComponent,
    ZardSkeletonComponent,
  ],
  templateUrl: './admin-translations-list-panel.html',
  styleUrl: './admin-translations-list-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationsListPanel {
  readonly query = input.required<AdminPhraseSetSearchQuery>();

  private readonly adminPhraseSetService = inject(AdminPhraseSetService);
  private readonly router = inject(Router);

  protected readonly searchResults = injectQuery(() =>
    this.adminPhraseSetService.searchQuery<PhraseSetWithStats>(this.query()),
  );

  protected readonly phraseSets = computed(() => this.searchResults.data()?.data ?? []);
  protected readonly total = computed(() => this.searchResults.data()?.total ?? 0);
  protected readonly pages = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.query().size)),
  );

  protected selectPage(page: number): void {
    void this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
