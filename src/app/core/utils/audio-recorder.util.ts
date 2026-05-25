export interface RecordedAudioFile {
  file: File;
  url: string;
  durationSeconds: number;
  mimeType: string;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private chunks: BlobPart[] = [];
  private startedAtMs = 0;

  get recording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  async start(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Audio recording is not supported in this browser');
    }

    if (this.recording) {
      return;
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = this.resolveSupportedMimeType();
    this.mediaRecorder = mimeType
      ? new MediaRecorder(this.mediaStream, { mimeType })
      : new MediaRecorder(this.mediaStream);

    this.chunks = [];
    this.startedAtMs = Date.now();

    this.mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    });

    this.mediaRecorder.start();
  }

  stop(): Promise<RecordedAudioFile> {
    if (!this.mediaRecorder || !this.recording) {
      return Promise.reject(new Error('Recorder is not currently recording'));
    }

    const recorder = this.mediaRecorder;

    return new Promise((resolve, reject) => {
      recorder.addEventListener(
        'stop',
        () => {
          try {
            const mimeType = recorder.mimeType || 'audio/webm';
            const extension = this.extensionFromMimeType(mimeType);
            const blob = new Blob(this.chunks, { type: mimeType });
            const file = new File([blob], `recording-${Date.now()}.${extension}`, { type: mimeType });
            const url = URL.createObjectURL(file);
            const durationSeconds = Math.max(1, Math.round((Date.now() - this.startedAtMs) / 1000));

            this.cleanupStream();
            this.mediaRecorder = null;
            this.chunks = [];

            resolve({ file, url, durationSeconds, mimeType });
          } catch (error) {
            reject(error instanceof Error ? error : new Error('Failed to finalize recording'));
          }
        },
        { once: true },
      );

      recorder.addEventListener(
        'error',
        () => {
          this.cleanupStream();
          this.mediaRecorder = null;
          reject(new Error('Failed to record audio'));
        },
        { once: true },
      );

      recorder.stop();
    });
  }

  dispose(): void {
    this.cleanupStream();
    this.mediaRecorder = null;
    this.chunks = [];
  }

  private cleanupStream(): void {
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.mediaStream = null;
  }

  private resolveSupportedMimeType(): string | null {
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];

    for (const mimeType of candidates) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType;
      }
    }

    return null;
  }

  private extensionFromMimeType(mimeType: string): string {
    if (mimeType.includes('mp4')) {
      return 'm4a';
    }

    return 'webm';
  }
}
