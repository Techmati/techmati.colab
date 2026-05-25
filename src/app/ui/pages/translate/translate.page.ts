import { TranslationEntryService } from '@/core/service/translation-entry/translation-entry.service';
import { type PhraseSetsInProgress } from '@/core/types/contributor-summary-response.type';
import { Phrase } from '@/core/types/phrase.type';
import { type RecordedAudioFile } from '@/core/utils/audio-recorder.util';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { tryCatch } from '@/core/utils/try.util';
import { BatchProgressPanel } from './ui/batch-progress-panel/batch-progress-panel';
import { BottomActionBar } from './ui/bottom-action-bar/bottom-action-bar';
import { PronunciationPanel } from './ui/pronunciation-panel/pronunciation-panel';
import { RecordedPronunciationMolecule } from './ui/recorded-pronunciation-molecule/recorded-pronunciation-molecule';
import { SourceTextPanel } from './ui/source-text-panel/source-text-panel';
import { TaskTopBar } from './ui/task-top-bar/task-top-bar';
import { TranslationInputPanel } from './ui/translation-input-panel/translation-input-panel';

@Component({
  selector: 'tm-translate-page',
  imports: [
    TaskTopBar,
    BatchProgressPanel,
    SourceTextPanel,
    TranslationInputPanel,
    PronunciationPanel,
    RecordedPronunciationMolecule,
    BottomActionBar,
  ],
  templateUrl: './translate.page.html',
  styleUrl: './translate.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatePage {
  private readonly translationEntryService = inject(TranslationEntryService);
  private readonly phraseSetsService = inject(PhraseSetsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly phraseSetId = input.required<string>();

  protected readonly showRecordedPronunciation = signal(false);
  protected readonly recordedAudio = signal<RecordedAudioFile | null>(null);
  protected readonly writtenTranslation = signal('');
  protected readonly isLoading = signal(false);
  protected readonly pronunciationMissing = signal(false);
  protected readonly translationMissing = signal(false);

  readonly phraseRes = rxResource({
    params: computed(() => ({ phraseSetId: this.phraseSetId() })),
    stream: ({ params: { phraseSetId } }) => {
      return this.translationEntryService.getNextPhraseInPhraseSet(phraseSetId);
    },
  });
  readonly phraseSetSummaryRes = rxResource({
    params: computed(() => ({ phraseSetId: this.phraseSetId() })),
    stream: ({ params: { phraseSetId } }) =>
      this.phraseSetsService.getPhraseSetSummaryByPhraseSetId(phraseSetId),
  });

  readonly phrase = computed<Phrase | null>(() => this.phraseRes.value() ?? null);
  readonly phraseSetSummary = computed<PhraseSetsInProgress | null>(
    () => this.phraseSetSummaryRes.value() ?? null,
  );

  constructor() {
    const translationEffect = effect(() => {
      this.translationMissing.set(!this.writtenTranslation());
    });
    this.destroyRef.onDestroy(() => {
      const currentAudio = this.recordedAudio();
      if (currentAudio) {
        URL.revokeObjectURL(currentAudio.url);
      }
      translationEffect.destroy();
    });
  }

  async goToNextPhrase() {
    const phrase = this.phrase();
    const pronunciation = this.getAudio();
    const translation = this.getTranslation();
    console.log(phrase, pronunciation);
    if (!phrase || !pronunciation || !translation) {
      return;
    }

    const entry = { phraseId: phrase.id, translation };
    console.log(entry);
    this.isLoading.set(true);
    const [result, error] = await tryCatch(
      this.translationEntryService.submit(entry, pronunciation),
    );
    console.log(result, error);
    this.isLoading.set(false);
  }

  private getAudio() {
    const audio = this.recordedAudio()?.file;
    if (!audio) {
      this.pronunciationMissing.set(true);
      return null;
      // throw new Error('No recorded pronunciation available.');
    }
    this.pronunciationMissing.set(false);
    return audio;
  }

  private getTranslation() {
    const translation = this.writtenTranslation();
    if (!translation) {
      this.translationMissing.set(true);
      return null;
      // throw new Error('No written translation provided.');
    }
    this.translationMissing.set(false);
    return translation;
  }

  protected onAudioRecorded(recordedAudio: RecordedAudioFile): void {
    const previousAudio = this.recordedAudio();
    if (previousAudio) {
      URL.revokeObjectURL(previousAudio.url);
    }
    this.pronunciationMissing.set(false);

    this.recordedAudio.set(recordedAudio);
    this.showRecordedPronunciation.set(true);
  }

  protected onRetryRecording(): void {
    const currentAudio = this.recordedAudio();
    if (currentAudio) {
      URL.revokeObjectURL(currentAudio.url);
    }

    this.recordedAudio.set(null);
    this.showRecordedPronunciation.set(false);
  }
}
