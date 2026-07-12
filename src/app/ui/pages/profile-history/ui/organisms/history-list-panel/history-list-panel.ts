import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService, PaginatedTranslations } from '@/core/service/translation/translation.service';
import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { defer, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ContributionCard } from '@/ui/molecules/contribution-card/contribution-card';
import { HistoryListPanelSkeleton } from '../history-list-panel-skeleton/history-list-panel-skeleton';

@Component({
  selector: 'tm-history-list-panel',
  imports: [ContributionCard, HistoryListPanelSkeleton],
  templateUrl: './history-list-panel.html',
  styleUrl: './history-list-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryListPanel {
  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);

  readonly completedSets = rxResource({
    stream: () =>
      defer(() => from(this.contributorContext.getActiveContributorId())).pipe(
        switchMap((cId) =>
          this.translationService.listByContributor(cId, {
            filter: 'completed',
            page: 1,
            size: 10,
            include_phrase_set: true,
          }),
        ),
      ),
  });

  protected readonly sets = linkedSignal<PaginatedTranslations | null, PaginatedTranslations | null>({
    source: () => (this.completedSets.value() as PaginatedTranslations | undefined) ?? null,
    computation: (source, previous) => source ?? previous?.value ?? null,
  });
}
