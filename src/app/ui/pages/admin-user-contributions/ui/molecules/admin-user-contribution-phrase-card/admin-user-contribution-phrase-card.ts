import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { type Phrase } from '@/core/types/phrase.type';
import { type TranslationEntry } from '@/core/types/translation-entry.type';
import { WavesAudioPlayer } from '@/ui/molecules/waves-audio-player/waves-audio-player';

type ContributedPhrase = Phrase & {
  translationEntries: TranslationEntry[];
};

@Component({
  selector: 'tm-admin-user-contribution-phrase-card',
  imports: [WavesAudioPlayer],
  templateUrl: './admin-user-contribution-phrase-card.html',
  styleUrl: './admin-user-contribution-phrase-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserContributionPhraseCard {
  readonly phrase = input.required<ContributedPhrase>();

  protected readonly entry = computed(() => this.phrase().translationEntries[0] ?? null);
}
