import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { injectQuery } from '@tanstack/angular-query-experimental';

import {
  PHRASE_SET_CATEGORY_LABELS,
  type PhraseSetCategory,
} from '@/core/config/phrase-set-category-labels.config';
import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { VariantSelectionDialog } from '@/ui/organisms/variant-selection-dialog/variant-selection-dialog';
import { AvailableContributionsPanelSkeleton } from '../available-contributions-panel-skeleton/available-contributions-panel-skeleton';

@Component({
  selector: 'tm-available-contributions-panel',
  imports: [
    ZardButtonComponent,
    ZardEmptyComponent,
    AvailableContributionsPanelSkeleton,
    VariantSelectionDialog,
  ],
  templateUrl: './available-contributions-panel.html',
  styleUrl: './available-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableContributionsPanel {
  private readonly phraseSetService = inject(PhraseSetsService);
  private readonly contributorContextService = inject(ContributorContextService);
  private readonly router = inject(Router);

  protected readonly dialog = viewChild.required(VariantSelectionDialog);

  protected readonly phraseSetsRes = injectQuery(() => {
    const contributorId = this.contributorContextService.active()?.id;
    return {
      ...this.phraseSetService.getFiltered({
        page: 1,
        size: 10,
        filter: 'untouched',
        contributorId: contributorId!,
      }),
      active: !!contributorId,
    };
  });
  readonly phraseSets = computed(() => this.phraseSetsRes.data()?.data ?? []);
  readonly isPending = computed(() => this.phraseSetsRes.isPending());

  date(string: string) {
    return new Date(string);
  }

  protected openDialog(psId: string): void {
    this.dialog().open(psId);
  }

  protected categoryLabel(category: PhraseSetCategory): string {
    return PHRASE_SET_CATEGORY_LABELS[category];
  }

  protected onTranslationCreated(translationId: string): void {
    this.router.navigate(['/translate', translationId]);
  }
}