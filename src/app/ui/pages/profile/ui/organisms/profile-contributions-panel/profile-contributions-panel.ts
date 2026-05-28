import { ChangeDetectionStrategy, Component, effect, inject, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslationEntryService } from '@/core/service/translation-entry/translation-entry.service';
import { PhraseSetsInProgress } from '@/core/types/contributor-summary-response.type';
import { ContributionCard } from '@/ui/molecules/contribution-card/contribution-card';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tm-profile-contributions-panel',
  imports: [RouterLink, ContributionCard],
  templateUrl: './profile-contributions-panel.html',
  styleUrl: './profile-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContributionsPanel {
  private readonly FILTER = 'completed';
  private readonly translationEntryService = inject(TranslationEntryService);

  readonly completedSets = rxResource({
    stream: () => this.translationEntryService.getFiltered(1, 10, this.FILTER),
  });

  protected readonly sets = linkedSignal<
    { data: PhraseSetsInProgress[]; total: number } | undefined,
    { data: PhraseSetsInProgress[]; total: number }
  >({
    source: () => this.completedSets.value(),
    computation: (source, previous) => source || previous?.value || { data: [], total: 0 },
  });

  constructor() {
    effect(() => console.log(this.sets()));
  }
}
