import { TranslationEntryService } from '@/core/service/translation-entry/translation-entry.service';
import { type PhraseSetsInProgress } from '@/core/types/contributor-summary-response.type';
import { Phrase } from '@/core/types/phrase.type';
import { type RecordedAudioFile } from '@/core/utils/audio-recorder.util';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { rxResource } from '@angular/core/rxjs-interop';

import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { tryCatch } from '@/core/utils/try.util';
import { BatchProgressPanel } from './ui/batch-progress-panel/batch-progress-panel';
import { BottomActionBar } from './ui/bottom-action-bar/bottom-action-bar';
import { PronunciationRecorder } from './ui/organisms/pronunciation-recorder/pronunciation-recorder';
import { TranslationTextarea } from './ui/organisms/translation-textarea/translation-textarea';
import { SourceTextPanel } from './ui/source-text-panel/source-text-panel';
import { TaskTopBar } from './ui/task-top-bar/task-top-bar';

@Component({
  selector: 'tm-translate-page',
  imports: [
    FormField,
    TaskTopBar,
    BatchProgressPanel,
    SourceTextPanel,
    TranslationTextarea,
    PronunciationRecorder,
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

  protected readonly isLoading = signal(false);
  protected readonly model = signal<{ translation: string; pronunciation: RecordedAudioFile | null }>({
    translation: '',
    pronunciation: null,
  });
  protected readonly form = form(this.model, (schema) => {
    required(schema.translation, { message: 'Añade una traducción escrita.' });
    minLength(schema.translation, 3, { message: 'La traducción debe tener al menos 3 caracteres.' });
    required(schema.pronunciation, { message: 'Añade una pronunciación grabada.' });
  });

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
    this.destroyRef.onDestroy(() => {
      const currentAudio = this.model().pronunciation;
      if (currentAudio) {
        URL.revokeObjectURL(currentAudio.url);
      }
    });
  }

  protected async goToNextPhrase() {
    this.form.translation().markAsTouched();
    this.form.pronunciation().markAsTouched();

    if (this.form().invalid()) {
      return;
    }

    const phrase = this.phrase();
    const pronunciation = this.model().pronunciation?.file ?? null;
    const translation = this.model().translation;
    if (!phrase || !pronunciation) {
      return;
    }

    const entry = { phraseId: phrase.id, translation };
    this.isLoading.set(true);
    const [_result, _error] = await tryCatch(this.translationEntryService.submit(entry, pronunciation));
    this.isLoading.set(false);
  }
}
