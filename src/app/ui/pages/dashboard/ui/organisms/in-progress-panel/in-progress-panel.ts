import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { defer, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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

  readonly inProgressRes = rxResource({
    stream: () =>
      defer(() => from(this.contributorContext.getActiveContributorId())).pipe(
        switchMap((cId) =>
          this.translationService.listByContributor(cId, {
            filter: 'in_progress',
            page: 1,
            size: 3,
            include_phrase_set: true,
          }),
        ),
      ),
  });

  readonly inProgress = computed(() => this.inProgressRes.value()?.data || []);
}
