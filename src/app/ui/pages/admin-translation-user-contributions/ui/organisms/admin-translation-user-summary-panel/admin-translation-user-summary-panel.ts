import { type Profile } from '@/core/dto/profile.dto';
import { type PhraseSetContributorSummary } from '@/core/types/summary.type';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'tm-admin-translation-user-summary-panel',
  imports: [ZardBadgeComponent, ZardSkeletonComponent],
  templateUrl: './admin-translation-user-summary-panel.html',
  styleUrl: './admin-translation-user-summary-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationUserSummaryPanel {
  readonly summary = input<PhraseSetContributorSummary | null>(null);
  readonly isLoading = input.required<boolean>();

  protected readonly contributor = computed(() => this.summary()?.contributor ?? null);
  protected readonly phraseSet = computed(() => this.summary()?.phraseSet ?? null);
  protected readonly initials = computed(() => this.getInitials(this.contributor()));
  protected readonly totalPhrases = computed(() => this.phraseSet()?.phraseCount ?? 0);
  protected readonly progressWidth = computed(
    () => `${Math.min(100, Math.max(0, this.summary()?.progressPercentage ?? 0))}%`,
  );

  private getInitials(contributor: Profile | null): string {
    const fullName = contributor?.fullName ?? '';
    const parts = fullName.split(' ').filter((part) => part.length > 0);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';

    return `${first}${last}`.toUpperCase() || '??';
  }
}
