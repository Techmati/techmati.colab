import { type RecordedAudioFile } from '@/core/utils/audio-recorder.util';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { WavesAudioPlayer } from '../molecules/waves-audio-player/waves-audio-player';

@Component({
  selector: 'tm-recorded-pronunciation-molecule',
  imports: [WavesAudioPlayer],
  templateUrl: './recorded-pronunciation-molecule.html',
  styleUrl: './recorded-pronunciation-molecule.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordedPronunciationMolecule {
  readonly recordedAudio = input.required<RecordedAudioFile>();
  readonly retry = output();

  protected onRetryClick(): void {
    this.retry.emit();
  }
}
