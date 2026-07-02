import { type PhraseSetWithStats } from '@/core/types/phrase-set.type';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tm-admin-translation-phrase-set-card',
  imports: [RouterLink],
  templateUrl: './admin-translation-phrase-set-card.html',
  styleUrl: './admin-translation-phrase-set-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationPhraseSetCard {
  readonly phraseSet = input.required<PhraseSetWithStats>();

  protected readonly contributorsCount = computed(
    () => this.phraseSet().stats.contributorsCount ?? 0,
  );
}
