import { type UserPhraseSetTranslationEntry } from '@/core/types/summary.type';
import { WavesAudioPlayer } from '@/ui/molecules/waves-audio-player/waves-audio-player';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tm-admin-translation-user-entry-card',
  imports: [WavesAudioPlayer],
  templateUrl: './admin-translation-user-entry-card.html',
  styleUrl: './admin-translation-user-entry-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationUserEntryCard {
  readonly entry = input.required<UserPhraseSetTranslationEntry>();
}
