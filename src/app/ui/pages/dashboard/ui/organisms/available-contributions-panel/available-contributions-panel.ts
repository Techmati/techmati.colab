import { DatePipe } from '@angular/common';
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
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { DialectSelectionDialog } from '@/ui/organisms/dialect-selection-dialog/dialect-selection-dialog';
import { AvailableContributionsPanelSkeleton } from '../available-contributions-panel-skeleton/available-contributions-panel-skeleton';

@Component({
  selector: 'tm-available-contributions-panel',
  imports: [
    ZardButtonComponent,
    DatePipe,
    ZardEmptyComponent,
    AvailableContributionsPanelSkeleton,
    DialectSelectionDialog,
  ],
  providers: [DatePipe],
  templateUrl: './available-contributions-panel.html',
  styleUrl: './available-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableContributionsPanel {
  private readonly translationDialog = viewChild.required(DialectSelectionDialog);

  private readonly phraseSetService = inject(PhraseSetsService);
  private readonly contributorContextService = inject(ContributorContextService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly phraseSetsRes = injectQuery(() => {
    const contributorId = this.contributorContextService.active()?.id;
    return {
      ...this.phraseSetService.getFiltered({
        page: 1,
        size: 3,
        filter: 'untouched',
        contributorId: contributorId!,
      }),
      active: !!contributorId,
    };
  });
  readonly phraseSets = computed(() => this.phraseSetsRes.data()?.data ?? []);

  protected readonly selectedPhraseSetId = signal<string | null>(null);

  date(string: string) {
    return new Date(string);
  }

  protected openTranslationDialog(phraseSetId: string): void {
    this.selectedPhraseSetId.set(phraseSetId);
    this.cdr.detectChanges();
    this.translationDialog().open();
  }

  protected onTranslationCreated(translationId: string): void {
    this.selectedPhraseSetId.set(null);
    this.router.navigate(['/translate', translationId]);
  }
}
