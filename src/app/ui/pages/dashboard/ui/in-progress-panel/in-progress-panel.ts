import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { InProgressCard } from '../in-progress-card/in-progress-card';

@Component({
  selector: 'tm-in-progress-panel',
  imports: [InProgressCard],
  templateUrl: './in-progress-panel.html',
  styleUrl: './in-progress-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InProgressPanel {
  private readonly phraseSetsService = inject(PhraseSetsService);

  readonly inProgressRes = rxResource({
    stream: () => this.phraseSetsService.getContributorSummary(),
  });

  readonly inProgress = computed(() => this.inProgressRes.value()?.phraseSetsInProgress || []);
}
