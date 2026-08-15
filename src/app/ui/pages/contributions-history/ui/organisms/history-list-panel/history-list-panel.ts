import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ContributionCard } from '@/ui/molecules/contribution-card/contribution-card';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
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

  readonly completedSetsRes = injectQuery(() => {
    const contributor = this.contributorContext.active()!;
    return {
      ...this.translationService.listByContributor(contributor.id, {
        filter: 'completed',
        page: 1,
        size: 10,
        include_phrase_set: true,
      }),
      enabled: !!contributor,
    };
  });
}
