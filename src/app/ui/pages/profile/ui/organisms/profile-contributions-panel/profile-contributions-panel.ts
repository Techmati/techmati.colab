import { ChangeDetectionStrategy, Component, effect, inject, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SummaryService } from '@/core/service/summary/summary.service';
import { FullSummary } from '@/core/types/summary.type';
import { ContributionCard } from '@/ui/molecules/contribution-card/contribution-card';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tm-profile-contributions-panel',
  imports: [RouterLink, ContributionCard],
  templateUrl: './profile-contributions-panel.html',
  styleUrl: './profile-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContributionsPanel {
  private readonly FILTER = 'completed';
  private readonly summaryService = inject(SummaryService);

  readonly completedSets = rxResource({
    stream: () => this.summaryService.getFiltered({ page: 1, size: 10 }, this.FILTER),
  });

  protected readonly sets = linkedSignal<
    { summaries: FullSummary[]; total: number } | undefined,
    { summaries: FullSummary[]; total: number }
  >({
    source: () => this.completedSets.value(),
    computation: (source, previous) => source || previous?.value || { summaries: [], total: 0 },
  });

  constructor() {
    effect(() => console.log(this.sets()));
  }
}
