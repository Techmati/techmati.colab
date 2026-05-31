import { SummaryService } from '@/core/service/summary/summary.service';
import { ChangeDetectionStrategy, Component, effect, inject, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tm-profile-summary-panel',
  imports: [],
  templateUrl: './profile-summary-panel.html',
  styleUrl: './profile-summary-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSummaryPanel {
  private readonly summaryService = inject(SummaryService);
  readonly isLoading = output<boolean>();

  readonly stats = rxResource({
    stream: () => this.summaryService.getStats(),
  });

  constructor() {
    effect(() => {
      this.isLoading.emit(this.stats.isLoading());
    });
  }
}
