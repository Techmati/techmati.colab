import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { injectQuery } from '@tanstack/angular-query-experimental';

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { DialectSelectionDialog } from '@/ui/organisms/dialect-selection-dialog/dialect-selection-dialog';

@Component({
  selector: 'tm-priority-panel',
  imports: [ZardButtonComponent, ZardSkeletonComponent, DialectSelectionDialog],
  templateUrl: './priority-panel.html',
  styleUrl: './priority-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityPanel {
  private readonly phraseSetService = inject(PhraseSetsService);
  private readonly contributorContext = inject(ContributorContextService);
  private readonly router = inject(Router);

  protected readonly dialog = viewChild.required(DialectSelectionDialog);

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
      enabled: !!contributorId,
    };
  });

  readonly prioritySets = computed(() => this.priorityRes.data()?.data || []);
  readonly isPending = computed(() => this.priorityRes.isPending());

  protected openDialog(psId: string): void {
    this.dialog().open(psId);
  }

  protected onTranslationCreated(translationId: string): void {
    this.router.navigate(['/translate', translationId]);
  }
}