import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { AvailableContributionsPanelSkeleton } from '../available-contributions-panel-skeleton/available-contributions-panel-skeleton';

@Component({
  selector: 'tm-available-contributions-panel',
  imports: [
    ZardButtonComponent,
    DatePipe,
    RouterLink,
    ZardEmptyComponent,
    AvailableContributionsPanelSkeleton,
  ],
  providers: [DatePipe],
  templateUrl: './available-contributions-panel.html',
  styleUrl: './available-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableContributionsPanel {
  private readonly phraseSetService = inject(PhraseSetsService);
  private readonly contributorContextService = inject(ContributorContextService);

  protected readonly phraseSetsRes = injectQuery(() => {
    const contributorId = this.contributorContextService.active()?.id;
    return {
      ...this.phraseSetService.getFiltered({
        page: 1,
        size: 3,
        filter: 'untouched',
        contributorId: contributorId!,
      }),
      active: !!contributorId,
    };
  });
  readonly phraseSets = computed(() => this.phraseSetsRes.data()?.data ?? []);

  date(string: string) {
    return new Date(string);
  }
}
