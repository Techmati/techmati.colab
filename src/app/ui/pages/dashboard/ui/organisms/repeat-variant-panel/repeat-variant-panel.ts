import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { injectQuery } from '@tanstack/angular-query-experimental';

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';
import { VariantSelectionDialog } from '@/ui/organisms/variant-selection-dialog/variant-selection-dialog';
import { AvailableContributionsPanelSkeleton } from '../available-contributions-panel-skeleton/available-contributions-panel-skeleton';

@Component({
  selector: 'tm-repeat-variant-panel',
  imports: [
    ZardButtonComponent,
    ...ZardCarouselImports,
    VariantSelectionDialog,
    AvailableContributionsPanelSkeleton,
  ],
  templateUrl: './repeat-variant-panel.html',
  styleUrl: './repeat-variant-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepeatVariantPanel {
  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly dialog = viewChild.required(VariantSelectionDialog);

  readonly completedRes = injectQuery(() => {
    const id = this.contributorContext.active()?.id;
    return {
      ...this.translationService.listByContributor(id!, {
        filter: 'completed',
        page: 1,
        size: 10,
        include_phrase_set: true,
      }),
      enabled: !!id,
    };
  });

  protected readonly selectedPhraseSetId = signal<string | null>(null);

  readonly completed = computed(() => this.completedRes.data()?.data || []);
  readonly isPending = computed(() => this.completedRes.isPending());

  protected openDialog(psId: string): void {
    this.selectedPhraseSetId.set(psId);
    this.cdr.detectChanges();
    this.dialog().open();
  }

  protected onTranslationCreated(translationId: string): void {
    this.router.navigate(['/translate', translationId]);
  }
}
