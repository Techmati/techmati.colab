import { type PhraseSetContributorSummary } from '@/core/types/summary.type';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardPaginationComponent } from '@/shared/components/pagination';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AdminTranslationContributorCard } from '../../molecules/admin-translation-contributor-card/admin-translation-contributor-card';

@Component({
  selector: 'tm-admin-translation-contributors-list-panel',
  imports: [
    AdminTranslationContributorCard,
    ZardEmptyComponent,
    ZardPaginationComponent,
    ZardSkeletonComponent,
  ],
  templateUrl: './admin-translation-contributors-list-panel.html',
  styleUrl: './admin-translation-contributors-list-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationContributorsListPanel {
  readonly summaries = input.required<readonly PhraseSetContributorSummary[]>();
  readonly total = input.required<number>();
  readonly page = input.required<number>();
  readonly pages = input.required<number>();
  readonly isLoading = input.required<boolean>();
  readonly pageChange = output<number>();
}
