import { TimeAgoPipe } from '@/core/pipes/time-ago.pipe';
import { type Profile } from '@/core/dto/profile.dto';
import { type PhraseSetContributorSummary } from '@/core/types/summary.type';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tm-admin-translation-contributor-card',
  imports: [RouterLink, TimeAgoPipe],
  templateUrl: './admin-translation-contributor-card.html',
  styleUrl: './admin-translation-contributor-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationContributorCard {
  readonly summary = input.required<PhraseSetContributorSummary>();

  protected readonly contributor = computed(() => this.summary().contributor);
  protected readonly phraseSet = computed(() => this.summary().phraseSet);
  protected readonly totalPhrases = computed(() => this.phraseSet()?.phraseCount ?? 0);
  protected readonly progressWidth = computed(
    () => `${this.clampPercentage(this.summary().progressPercentage)}%`,
  );
  protected readonly statusLabel = computed(() => (this.summary().completed ? 'Completado' : 'Pendiente'));
  protected readonly statusClass = computed(() =>
    this.summary().completed
      ? 'text-xs font-medium leading-4 text-brand-green-600'
      : 'text-xs font-medium leading-4 text-text-secondary',
  );
  protected readonly progressTextClass = computed(() =>
    this.summary().completed
      ? 'text-xs font-bold leading-4 text-brand-green-600'
      : 'text-xs font-bold leading-4 text-primary',
  );
  protected readonly initials = computed(() => this.getInitials(this.contributor()));

  private getInitials(contributor: Profile | null): string {
    const fullName = contributor?.fullName ?? '';
    const parts = fullName.split(' ').filter((part) => part.length > 0);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';

    return `${first}${last}`.toUpperCase() || '??';
  }

  private clampPercentage(progressPercentage: number): number {
    return Math.min(100, Math.max(0, progressPercentage));
  }
}
