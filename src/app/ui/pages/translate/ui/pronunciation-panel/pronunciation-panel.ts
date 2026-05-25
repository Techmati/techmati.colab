import { AudioRecorder, type RecordedAudioFile } from '@/core/utils/audio-recorder.util';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal } from '@angular/core';

@Component({
  selector: 'tm-pronunciation-panel',
  imports: [],
  templateUrl: './pronunciation-panel.html',
  styleUrl: './pronunciation-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PronunciationPanel {
  readonly recorded = output<RecordedAudioFile>();

  private readonly recorder = new AudioRecorder();
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isRecording = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.recorder.dispose();
    });
  }

  protected async onRecordButtonClick(): Promise<void> {
    this.errorMessage.set(null);

    try {
      if (!this.isRecording()) {
        await this.recorder.start();
        this.isRecording.set(true);
        return;
      }

      const recordedAudio = await this.recorder.stop();
      this.isRecording.set(false);
      this.recorded.emit(recordedAudio);
    } catch (error) {
      this.isRecording.set(false);
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo grabar el audio');
    }
  }
}
