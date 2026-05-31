import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  linkedSignal,
  output,
} from '@angular/core';

import { SummaryService } from '@/core/service/summary/summary.service';
import { FullSummary } from '@/core/types/summary.type';
import { ContributionCard } from '@/ui/molecules/contribution-card/contribution-card';
import { rxResource } from '@angular/core/rxjs-interop';

//TODO: refactor duplicated code
@Component({
  selector: 'tm-history-list-panel',
  imports: [ContributionCard],
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

  readonly isLoading = output<boolean>();

  protected readonly sets = linkedSignal<
    { summaries: FullSummary[]; total: number } | undefined,
    { summaries: FullSummary[]; total: number }
  >({
    source: () => this.completedSets.value(),
    computation: (source, previous) => source || previous?.value || { summaries: [], total: 0 },
  });

  constructor() {
    effect(() => this.isLoading.emit(this.completedSets.isLoading()));
  }
}
