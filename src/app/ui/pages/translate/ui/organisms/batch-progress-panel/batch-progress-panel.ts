import { SummaryService } from '@/core/service/summary/summary.service';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { SkeletonComponent } from 'boneyard-js/angular';

@Component({
  selector: 'tm-batch-progress-panel',
  imports: [SkeletonComponent],
  templateUrl: './batch-progress-panel.html',
})
export class BatchProgressPanel {
  readonly phraseSetId = input.required<string>();
  readonly nextPhraseTick = input.required<number>();

  private readonly summaryService = inject(SummaryService);

  private readonly router = inject(Router);

  private initialLoad = false;

  readonly summary = rxResource({
    params: computed(() => ({ phraseSetId: this.phraseSetId(), tick: this.nextPhraseTick() })),
    stream: ({ params: { phraseSetId } }) => this.summaryService.getPhraseSumary(phraseSetId),
  });

  readonly progressPercentage = linkedSignal<number | undefined, number>({
    source: () => this.summary.value()?.progressPercentage || 0,
    computation: (source, previous) => source || previous?.value || 0,
  });

  readonly isLoading = computed(() => this.summary.isLoading() && !this.initialLoad);

  constructor() {
    effect(() => {
      if (!this.summary.isLoading()) {
        this.initialLoad = true;
      }
    });
    effect(() => {
      if (this.summary.value()?.progressPercentage === 100) {
        this.router.navigate(['/translate', this.phraseSetId(), 'end'], {
          queryParams: { phraseSetCount: this.summary.value()?.phraseSet?.phraseCount },
        });
      }
    });
    effect(() => console.log('progressPercentage', this.progressPercentage()));
  }
}
