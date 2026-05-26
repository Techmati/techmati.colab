import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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
  private readonly router = inject(Router);

  readonly translationCountRes = rxResource({
    stream: () => this.translationEntryService.getTodayTranslationCount(),
  });

  readonly nextSet = rxResource({
    stream: () => this.translationEntryService.getNextPhraseSet(),
  });

  constructor() {
    effect(() => console.log(this.phraseSetCount()));
    effect(() => console.log(this.phraseSetId()));
    effect(() => console.log(this.nextSet.value()));
  }

  protected goToNextSet() {
    this.router.navigate(['/translate', this.nextSet.value()]);
  }
}
