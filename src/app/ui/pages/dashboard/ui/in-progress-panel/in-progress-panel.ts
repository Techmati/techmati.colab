import { TranslationEntryService } from '@/core/service/translation-entry/translation-entry.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
} from '@angular/core';
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
  readonly loading = output<boolean>();

  private readonly translationEntryService = inject(TranslationEntryService);

  readonly inProgressRes = rxResource({
    stream: () => this.translationEntryService.getContributorSummary(),
  });

  readonly inProgress = computed(() => this.inProgressRes.value()?.phraseSetsInProgress || []);

  constructor() {
    effect(() => {
      this.loading.emit(this.inProgressRes.isLoading());
    });
  }
}
