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
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { VariantSelectionDialog } from '@/ui/organisms/variant-selection-dialog/variant-selection-dialog';

@Component({
  selector: 'tm-priority-panel',
  imports: [ZardButtonComponent, ZardSkeletonComponent, VariantSelectionDialog],
  templateUrl: './priority-panel.html',
  styleUrl: './priority-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityPanel {
  private readonly phraseSetService = inject(PhraseSetsService);
  private readonly contributorContext = inject(ContributorContextService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly selectedPhraseSetId = signal<string | null>(null);

  protected readonly dialog = viewChild.required(VariantSelectionDialog);

  readonly priorityRes = injectQuery(() => {
    const contributorId = this.contributorContext.active()?.id;
    return {
      ...this.phraseSetService.getFiltered({
        page: 1,
        size: 10,
        filter: 'untouched',
        sort_by: 'contributorsCount',
        sort_direction: 'asc',
        include_stats: 'true',
        contributorId: contributorId!,
      }),
    };
  });

  readonly prioritySets = computed(() => this.priorityRes.data()?.data || []);
  readonly isPending = computed(() => this.priorityRes.isPending());

  protected openDialog(psId: string): void {
    this.selectedPhraseSetId.set(psId);
    this.cdr.detectChanges();
    this.dialog().open();
  }

  protected onTranslationCreated(translationId: string): void {
    this.router.navigate(['/translate', translationId]);
  }
}
