import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SummaryService } from '@/core/service/summary/summary.service';
import { TranslationEntryService } from '@/core/service/translation-entry/translation-entry.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tm-translation-end-page',
  imports: [RouterLink, ZardButtonComponent],
  templateUrl: './translation-end.page.html',
  styleUrl: './translation-end.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationEndPage {
  readonly phraseSetId = input.required<string>();
  readonly phraseSetCount = input.required<number>();

  private readonly translationEntryService = inject(TranslationEntryService);
  private readonly summaryService = inject(SummaryService);

  readonly translationCountRes = rxResource({
    stream: () => this.summaryService.getStats(),
  });

  readonly noNextSet = computed(() => this.nextSet.value()?.state == 'finished');

  readonly nextSet = rxResource({
    stream: () => this.translationEntryService.getNextPhraseSet(),
  });
}
