import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import {
  ListByContributorOptions,
  TranslationService,
} from '@/core/service/translation/translation.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';
import { InProgressPanelSkeleton } from '../in-progress-panel-skeleton/in-progress-panel-skeleton';

@Component({
  selector: 'tm-in-progress-panel',
  imports: [ZardButtonComponent, ...ZardCarouselImports, InProgressPanelSkeleton],
  templateUrl: './in-progress-panel.html',
  styleUrl: './in-progress-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InProgressPanel {
  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);
  private readonly router = inject(Router);

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
    size: 10,
    include_phrase_set: true,
  };

  readonly inProgress = computed(() => this.inProgressRes.data()?.data || []);

  protected continue(taskId: string): void {
    this.router.navigate(['/translate', taskId]);
  }
}