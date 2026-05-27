import { TranslationEntryService } from '@/core/service/translation-entry/translation-entry.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'tm-batch-progress-panel',
  imports: [],
  templateUrl: './batch-progress-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchProgressPanel {
  private readonly translationEntryService = inject(TranslationEntryService);
  private readonly router = inject(Router);

  private readonly destroyRef = inject(DestroyRef);

  readonly phraseSetId = input.required<string>();
  readonly nextPhraseTick = input.required<number>();

  readonly summary = rxResource({
    params: computed(() => ({ phraseSetId: this.phraseSetId(), tick: this.nextPhraseTick() })),
    stream: ({ params: { phraseSetId } }) =>
      this.translationEntryService.getPhraseSetSummary(phraseSetId),
  });

  constructor() {
    const endEffect = effect(() => {
      if (this.summary.value()?.progressPercentage === 100) {
        this.router.navigate(['/translate', this.phraseSetId(), 'end'], {
          queryParams: { phraseSetCount: this.summary.value()?.phraseSet?.phraseCount },
        });
      }
    });
    this.destroyRef.onDestroy(() => {
      endEffect.destroy();
    });
    effect(() => console.log(this.summary.value()));
  }
}
