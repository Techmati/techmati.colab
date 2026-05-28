import { SummaryService } from '@/core/service/summary/summary.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { InProgressCard } from '../../molecules/in-progress-card/in-progress-card';

@Component({
  selector: 'tm-in-progress-panel',
  imports: [InProgressCard],
  templateUrl: './in-progress-panel.html',
  styleUrl: './in-progress-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InProgressPanel {
  readonly loading = output<boolean>();

  private readonly summaryService = inject(SummaryService);

  readonly inProgressRes = rxResource({
    params: computed(() => ({ page: 1, size: 3 })),
    stream: ({ params: { page, size } }) =>
      this.summaryService.getFiltered({ page, size }, 'in_progress'),
  });

  readonly inProgress = computed(() => this.inProgressRes.value()?.summaries || []);

  constructor() {
    effect(() => {
      this.loading.emit(this.inProgressRes.isLoading());
    });
  }
}
