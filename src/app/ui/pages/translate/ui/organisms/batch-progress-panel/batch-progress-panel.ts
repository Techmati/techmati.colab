import { Translation } from '@/core/types/translation.type';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { Router } from '@angular/router';
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

  readonly progressPercentage = linkedSignal<number | undefined, number>({
    source: () => this.translation()?.progressPercentage || 0,
    computation: (source, previous) => source || previous?.value || 0,
  });

  constructor() {
    effect(() => {
      const t = this.translation();
      if (t && t.completed) {
        this.router.navigate(['/translate', t.id, 'end']);
      }
    });
  }
}
