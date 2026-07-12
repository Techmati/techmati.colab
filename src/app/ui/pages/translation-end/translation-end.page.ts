import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ZardButtonComponent } from '@/shared/components/button';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { defer, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NextSetActionSkeleton } from './ui/molecules/next-set-action-skeleton/next-set-action-skeleton';
import { TranslationSummarySkeleton } from './ui/organisms/translation-summary-skeleton/translation-summary-skeleton';

@Component({
  selector: 'tm-translation-end-page',
  imports: [RouterLink, ZardButtonComponent, NextSetActionSkeleton, TranslationSummarySkeleton],
  templateUrl: './translation-end.page.html',
  styleUrl: './translation-end.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationEndPage {
  readonly phraseSetId = input.required<string>();
  readonly phraseSetCount = input.required<number>();

  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);
  private readonly phraseSetsService = inject(PhraseSetsService);

  readonly translationCountRes = rxResource({
    stream: () =>
      defer(() => from(this.contributorContext.getActiveContributorId())).pipe(
        switchMap((cId) => this.translationService.getStats(cId)),
      ),
  });

  readonly nextSet = rxResource({
    stream: () => this.phraseSetsService.getNextPending(),
  });

  readonly noNextSet = computed(() => this.nextSet.value()?.state === 'finished');
}
