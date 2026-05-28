import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';

import { TranslationEntryService } from '@/core/service/translation-entry/translation-entry.service';
import { PhraseSetsInProgress } from '@/core/types/contributor-summary-response.type';
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
  private readonly translationEntryService = inject(TranslationEntryService);
  readonly completedSets = rxResource({
    stream: () => this.translationEntryService.getFiltered(1, 10, this.FILTER),
  });

  protected readonly sets = linkedSignal<
    { data: PhraseSetsInProgress[]; total: number } | undefined,
    { data: PhraseSetsInProgress[]; total: number }
  >({
    source: () => this.completedSets.value(),
    computation: (source, previous) => source || previous?.value || { data: [], total: 0 },
  });
}
