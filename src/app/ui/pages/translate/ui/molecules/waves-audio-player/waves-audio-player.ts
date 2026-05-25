import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'tm-waves-audio-player',
  imports: [],
  templateUrl: './waves-audio-player.html',
  styleUrl: './waves-audio-player.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WavesAudioPlayer implements AfterViewInit {
  readonly audioUrl = input.required<string>();
  readonly initialDurationSeconds = input<number>(0);

  private readonly waveformContainer = viewChild.required<ElementRef<HTMLDivElement>>('waveform');
  private readonly destroyRef = inject(DestroyRef);

  private waveSurfer: WaveSurfer | null = null;
  private previousAudioUrl: string | null = null;

  protected readonly playing = signal(false);
  protected readonly currentTimeSeconds = signal(0);
  protected readonly durationSeconds = signal(0);

  constructor() {
    effect(() => {
      this.audioUrl();
      this.syncSource();
    });

    this.destroyRef.onDestroy(() => {
      this.teardownWaveSurfer();
    });
  }

  ngAfterViewInit(): void {
    this.setupWaveSurfer();
    this.syncSource();
  }

  protected togglePlayback(): void {
    if (!this.waveSurfer) {
      return;
    }

    void this.waveSurfer.playPause();
  }

  protected get elapsedLabel(): string {
    return this.formatDuration(this.currentTimeSeconds());
  }

  protected get durationLabel(): string {
    const currentDuration = this.durationSeconds() || this.initialDurationSeconds();
    return this.formatDuration(currentDuration);
  }

  private setupWaveSurfer(): void {
    if (this.waveSurfer) {
      return;
    }

    this.waveSurfer = WaveSurfer.create({
      container: this.waveformContainer().nativeElement,
      waveColor: 'rgb(218, 222, 245)',
      progressColor: 'rgb(95, 96, 197)',
      barWidth: 3,
      barGap: 2,
      barRadius: 50,
      height: 24,
      normalize: true,
      dragToSeek: true,
      interact: true,
    });

    this.waveSurfer.on('ready', () => {
      this.durationSeconds.set(Math.floor(this.waveSurfer?.getDuration() || 0));
    });

    this.waveSurfer.on('timeupdate', (currentTime) => {
      this.currentTimeSeconds.set(Math.floor(currentTime));
    });

    this.waveSurfer.on('play', () => {
      this.playing.set(true);
    });

    this.waveSurfer.on('pause', () => {
      this.playing.set(false);
    });

    this.waveSurfer.on('finish', () => {
      this.playing.set(false);
      this.currentTimeSeconds.set(0);
    });
  }

  private syncSource(): void {
    const nextAudioUrl = this.audioUrl();
    if (!this.waveSurfer || !nextAudioUrl || nextAudioUrl === this.previousAudioUrl) {
      return;
    }

    this.previousAudioUrl = nextAudioUrl;
    this.currentTimeSeconds.set(0);
    this.durationSeconds.set(0);
    this.waveSurfer.load(nextAudioUrl);
  }

  private teardownWaveSurfer(): void {
    this.waveSurfer?.destroy();
    this.waveSurfer = null;
  }

  private formatDuration(totalSeconds: number): string {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(safeSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(safeSeconds % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}
