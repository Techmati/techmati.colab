import { type RecordedAudioFile } from '@/core/utils/audio-recorder.util';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { WavesAudioPlayer } from '../../../../../molecules/waves-audio-player/waves-audio-player';

@Component({
  selector: 'tm-recorded-pronunciation-panel',
  imports: [WavesAudioPlayer],
  templateUrl: './recorded-pronunciation-panel.html',
  styleUrl: './recorded-pronunciation-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordedPronunciationPanel {
  readonly recordedAudio = input.required<RecordedAudioFile>();
  readonly retry = output();

  protected onRetryClick(): void {
    this.retry.emit();
  }
}
