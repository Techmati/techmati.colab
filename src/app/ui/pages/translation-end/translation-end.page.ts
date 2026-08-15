import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { VariantSelectionDialog } from '@/ui/organisms/variant-selection-dialog/variant-selection-dialog';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { NextSetActionSkeleton } from './ui/molecules/next-set-action-skeleton/next-set-action-skeleton';
import { TranslationSummarySkeleton } from './ui/organisms/translation-summary-skeleton/translation-summary-skeleton';

@Component({
  selector: 'tm-translation-end-page',
  imports: [
    RouterLink,
    ZardButtonComponent,
    NextSetActionSkeleton,
    TranslationSummarySkeleton,
    VariantSelectionDialog,
  ],
  templateUrl: './translation-end.page.html',
  styleUrl: './translation-end.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationEndPage {
  readonly translationId = input.required<string>();
  readonly phraseCount = input.required<number>();

  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);
  private readonly phraseSetsService = inject(PhraseSetsService);
  private readonly router = inject(Router);

  readonly translationCountRes = injectQuery(() => {
    const contributor = this.contributorContext.active()!;
    return {
      enabled: !!contributor,
      ...this.translationService.getStats(contributor.id),
    };
  });

  readonly nextSetRes = injectQuery(() => {
    const contributor = this.contributorContext.active()!;
    return {
      enabled: !!contributor,
      ...this.phraseSetsService.getNextPending(contributor.id),
    };
  });

  readonly noNextSet = computed(() => this.nextSetRes.data()?.state === 'finished');

  protected onTranslationCreated(translationId: string): void {
    this.router.navigate(['/translate', translationId]);
  }

  protected close(): void {
    this.router.navigate(['/dashboard']);
  }
}
