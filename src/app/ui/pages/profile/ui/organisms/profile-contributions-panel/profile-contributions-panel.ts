import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SummaryService } from '@/core/service/summary/summary.service';
import { PhraseSetSummary } from '@/core/types/summary.type';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ContributionCard } from '@/ui/molecules/contribution-card/contribution-card';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProfileContributionsPanelSkeleton } from '../profile-contributions-panel-skeleton/profile-contributions-panel-skeleton';

@Component({
  selector: 'tm-profile-contributions-panel',
  imports: [RouterLink, ContributionCard, ZardEmptyComponent, ProfileContributionsPanelSkeleton],
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
    { summaries: PhraseSetSummary[]; total: number } | undefined,
    { summaries: PhraseSetSummary[]; total: number }
  >({
    source: () => this.completedSets.value(),
    computation: (source, previous) => source || previous?.value || { summaries: [], total: 0 },
  });
}
