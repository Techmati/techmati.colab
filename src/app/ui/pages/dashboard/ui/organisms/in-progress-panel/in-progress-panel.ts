import { SummaryService } from '@/core/service/summary/summary.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { InProgressCard } from '../../molecules/in-progress-card/in-progress-card';
import { InProgressPanelSkeleton } from '../in-progress-panel-skeleton/in-progress-panel-skeleton';

@Component({
  selector: 'tm-in-progress-panel',
  imports: [InProgressCard, InProgressPanelSkeleton],
  templateUrl: './in-progress-panel.html',
  styleUrl: './in-progress-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InProgressPanel {
  private readonly summaryService = inject(SummaryService);

  readonly inProgressRes = rxResource({
    params: computed(() => ({ page: 1, size: 3 })),
    stream: ({ params: { page, size } }) =>
      this.summaryService.getFiltered({ page, size }, 'in_progress'),
  });

  readonly inProgress = computed(() => this.inProgressRes.value()?.summaries || []);
}
