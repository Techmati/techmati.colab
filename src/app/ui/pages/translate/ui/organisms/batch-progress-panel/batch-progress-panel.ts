import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { defer, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BatchProgressPanelSkeleton } from '../batch-progress-panel-skeleton/batch-progress-panel-skeleton';

@Component({
  selector: 'tm-batch-progress-panel',
  imports: [BatchProgressPanelSkeleton],
  templateUrl: './batch-progress-panel.html',
  styleUrl: './batch-progress-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchProgressPanel {
  readonly phraseSetId = input.required<string>();
  readonly nextPhraseTick = input.required<number>();

  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);
  private readonly router = inject(Router);

  readonly summary = rxResource({
    params: computed(() => ({
      phraseSetId: this.phraseSetId(),
      tick: this.nextPhraseTick(),
    })),
    stream: ({ params }) =>
      defer(() => from(this.contributorContext.getActiveContributorIdAsync())).pipe(
        switchMap((contributorId) =>
          this.translationService.listByContributorObservable(contributorId, {
            filter: 'all',
            page: 1,
            size: 50,
          }),
        ),
        switchMap((list) => {
          const found = list.data.find((t) => t.phraseSetId === params.phraseSetId) ?? null;
          return of(found);
        }),
      ),
  });

  readonly progressPercentage = linkedSignal<number | undefined, number>({
    source: () => this.summary.value()?.progressPercentage || 0,
    computation: (source, previous) => source || previous?.value || 0,
  });

  constructor() {
    effect(() => {
      const t = this.summary.value();
      if (t && t.completed) {
        this.router.navigate(['/translate', this.phraseSetId(), 'end']);
      }
    });
  }
}
