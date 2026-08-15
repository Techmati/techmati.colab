import { Translation } from '@/core/types/translation.type';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { BatchProgressPanelSkeleton } from '../batch-progress-panel-skeleton/batch-progress-panel-skeleton';

@Component({
  selector: 'tm-batch-progress-panel',
  imports: [BatchProgressPanelSkeleton],
  templateUrl: './batch-progress-panel.html',
  styleUrl: './batch-progress-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchProgressPanel {
  readonly translation = input.required<Translation | null>();

  private readonly router = inject(Router);
  private readonly queryClient = inject(QueryClient);

  readonly progressPercentage = computed<number>(() => this.translation()?.progressPercentage || 0);

  constructor() {
    effect(() => {
      const t = this.translation();
      if (t && t.completed) {
        void this.completeTranslation(t);
      }
    });
  }

  private async completeTranslation(t: Translation): Promise<void> {
    await this.queryClient.invalidateQueries({ queryKey: ['phraseSets'] });
    await this.router.navigate(['/translate', t.id, 'end'], {
      queryParams: { phraseCount: t.phraseCount },
    });
  }
}
