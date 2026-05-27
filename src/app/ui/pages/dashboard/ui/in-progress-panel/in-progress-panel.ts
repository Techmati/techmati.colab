import { TranslationEntryService } from '@/core/service/translation-entry/translation-entry.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SkeletonComponent } from 'boneyard-js/angular';
import { InProgressCard } from '../in-progress-card/in-progress-card';

@Component({
  selector: 'tm-in-progress-panel',
  imports: [InProgressCard, SkeletonComponent],
  templateUrl: './in-progress-panel.html',
  styleUrl: './in-progress-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InProgressPanel {
  private readonly translationEntryService = inject(TranslationEntryService);

  readonly inProgressRes = rxResource({
    stream: () => this.translationEntryService.getContributorSummary(),
  });

  readonly inProgress = computed(() => this.inProgressRes.value()?.phraseSetsInProgress || []);
}
