import { AudioRecorder, type RecordedAudioFile } from '@/core/utils/audio-recorder.util';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { WavesAudioPlayer } from '../../molecules/waves-audio-player/waves-audio-player';

type OnChangeFn = (value: RecordedAudioFile | null) => void;
type OnTouchedFn = () => void;

@Component({
  selector: 'tm-pronunciation-recorder',
  imports: [WavesAudioPlayer],
  templateUrl: './pronunciation-recorder.html',
  styleUrl: './pronunciation-recorder.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PronunciationRecorder),
      multi: true,
    },
  ],
})
export class PronunciationRecorder implements ControlValueAccessor {
  private readonly recorder = new AudioRecorder();
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isRecording = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly disabled = signal(false);
  protected readonly recordedAudio = signal<RecordedAudioFile | null>(null);

  private onChange: OnChangeFn = () => undefined;
  private onTouched: OnTouchedFn = () => undefined;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.revokeAudioUrl(this.recordedAudio());
      this.recorder.dispose();
    });
  }

  writeValue(value: RecordedAudioFile | null): void {
    const previousAudio = this.recordedAudio();
    if (previousAudio && previousAudio.url !== value?.url) {
      this.revokeAudioUrl(previousAudio);
    }

    this.recordedAudio.set(value);
  }

  registerOnChange(fn: OnChangeFn): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected async onRecordButtonClick(): Promise<void> {
    if (this.disabled()) {
      return;
    }

    this.errorMessage.set(null);

    try {
      if (!this.isRecording()) {
        await this.recorder.start();
        this.isRecording.set(true);
        return;
      }

      const audio = await this.recorder.stop();
      this.isRecording.set(false);
      this.onTouched();

      const previousAudio = this.recordedAudio();
      if (previousAudio) {
        this.revokeAudioUrl(previousAudio);
      }

      this.recordedAudio.set(audio);
      this.onChange(audio);
    } catch (error) {
      this.isRecording.set(false);
      this.errorMessage.set(error instanceof Error ? error.message : 'No se pudo grabar el audio');
    }
  }

  protected onRetryRecording(): void {
    if (this.disabled()) {
      return;
    }

    this.onTouched();

    const current = this.recordedAudio();
    if (current) {
      this.revokeAudioUrl(current);
    }

    this.recordedAudio.set(null);
    this.onChange(null);
  }

  private revokeAudioUrl(audio: RecordedAudioFile | null): void {
    if (audio) {
      URL.revokeObjectURL(audio.url);
    }
  }
}
