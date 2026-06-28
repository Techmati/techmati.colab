import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';

import { SummaryService } from '@/core/service/summary/summary.service';
import { PhraseSetSummary } from '@/core/types/summary.type';
import { ContributionCard } from '@/ui/molecules/contribution-card/contribution-card';
import { rxResource } from '@angular/core/rxjs-interop';
import { HistoryListPanelSkeleton } from '../history-list-panel-skeleton/history-list-panel-skeleton';

//TODO: refactor duplicated code
@Component({
  selector: 'tm-history-list-panel',
  imports: [ContributionCard, HistoryListPanelSkeleton],
  templateUrl: './history-list-panel.html',
  styleUrl: './history-list-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryListPanel {
  private readonly FILTER = 'completed';
  private readonly summaryService = inject(SummaryService);

  readonly completedSets = rxResource({
    stream: () => this.summaryService.getFiltered({ page: 1, size: 10 }, this.FILTER),
  });

  protected readonly sets = linkedSignal<
    { summaries: PhraseSetSummary[]; total: number } | undefined,
    { summaries: PhraseSetSummary[]; total: number }
  >({
    source: () => this.completedSets.value(),
    computation: (source, previous) => source || previous?.value || { summaries: [], total: 0 },
  });
}
