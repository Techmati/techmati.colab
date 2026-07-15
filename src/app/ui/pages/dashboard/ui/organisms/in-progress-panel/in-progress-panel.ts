import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import {
  ListByContributorOptions,
  TranslationService,
} from '@/core/service/translation/translation.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { InProgressCard } from '../../molecules/in-progress-card/in-progress-card';
import { InProgressPanelSkeleton } from '../in-progress-panel-skeleton/in-progress-panel-skeleton';

@Component({
  selector: 'tm-in-progress-panel',
  imports: [InProgressCard, InProgressPanelSkeleton],
  templateUrl: './in-progress-panel.html',
  styleUrl: './in-progress-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InProgressPanel {
  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);

  readonly activeContributor = computed(() => this.contributorContext.active());

  readonly inProgressRes = injectQuery(() => {
    const id = this.activeContributor()?.id;
    return {
      ...this.translationService.listByContributor(id!, this.listByContributorFilters),
      enabled: !!id,
    };
  });

  readonly listByContributorFilters: ListByContributorOptions = {
    filter: 'in_progress',
    page: 1,
    size: 3,
    include_phrase_set: true,
  };

  readonly inProgress = computed(() => this.inProgressRes.data()?.data || []);
}
