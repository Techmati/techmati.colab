import { SummaryService } from '@/core/service/summary/summary.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProfileSummaryPanelSkeleton } from '../profile-summary-panel-skeleton/profile-summary-panel-skeleton';

@Component({
  selector: 'tm-profile-summary-panel',
  imports: [ProfileSummaryPanelSkeleton],
  templateUrl: './profile-summary-panel.html',
  styleUrl: './profile-summary-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSummaryPanel {
  private readonly summaryService = inject(SummaryService);

  readonly stats = rxResource({
    stream: () => this.summaryService.getStats(),
  });
}
