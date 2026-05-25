import { type RecordedAudioFile } from '@/core/utils/audio-recorder.util';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'tm-recorded-pronunciation-molecule',
  imports: [],
  templateUrl: './recorded-pronunciation-molecule.html',
  styleUrl: './recorded-pronunciation-molecule.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordedPronunciationMolecule {
  readonly recordedAudio = input.required<RecordedAudioFile>();
  readonly retry = output();

  private readonly audioRef = viewChild<ElementRef<HTMLAudioElement>>('audioRef');

  protected readonly playing = signal(false);
  protected readonly currentTimeSeconds = signal(0);

  protected get durationLabel(): string {
    return this.formatDuration(this.recordedAudio().durationSeconds);
  }

  protected togglePlayback(): void {
    const audio = this.audioRef()?.nativeElement;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      void audio.play();
      this.playing.set(true);
      return;
    }

    audio.pause();
    this.playing.set(false);
  }

  protected onTimeUpdate(): void {
    const audio = this.audioRef()?.nativeElement;
    if (!audio) {
      return;
    }

    this.currentTimeSeconds.set(Math.floor(audio.currentTime));
  }

  protected onEnded(): void {
    this.playing.set(false);
    this.currentTimeSeconds.set(0);
  }

  protected onRetryClick(): void {
    const audio = this.audioRef()?.nativeElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.playing.set(false);
    this.currentTimeSeconds.set(0);
    this.retry.emit();
  }

  protected get elapsedLabel(): string {
    return this.formatDuration(this.currentTimeSeconds());
  }

  private formatDuration(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}
