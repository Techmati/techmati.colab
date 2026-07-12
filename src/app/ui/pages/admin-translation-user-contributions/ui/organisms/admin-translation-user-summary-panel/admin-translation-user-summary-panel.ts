import { type Translation } from '@/core/types/translation.type';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'tm-admin-translation-user-summary-panel',
  imports: [ZardSkeletonComponent],
  templateUrl: './admin-translation-user-summary-panel.html',
  styleUrl: './admin-translation-user-summary-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationUserSummaryPanel {
  readonly summary = input<Translation | null>(null);
  readonly isLoading = input.required<boolean>();

  protected readonly totalPhrases = computed(() => this.summary()?.phraseCount ?? 0);
  protected readonly progressWidth = computed(
    () => `${Math.min(100, Math.max(0, this.summary()?.progressPercentage ?? 0))}%`,
  );
  protected readonly progressText = computed(
    () => `${this.summary()?.contributedEntriesCount ?? 0}/${this.totalPhrases()} frases`,
  );
}
