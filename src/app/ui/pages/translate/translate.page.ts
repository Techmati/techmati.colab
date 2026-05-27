import { TranslationEntryService } from '@/core/service/translation-entry/translation-entry.service';
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
import { rxResource } from '@angular/core/rxjs-interop';
import { form, FormField, minLength, required } from '@angular/forms/signals';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly translationEntryService = inject(TranslationEntryService);

  readonly phraseSetId = input.required<string>();
  readonly phraseId = signal('');

  protected readonly isUploading = signal(false);
  protected readonly nextPhraseTick = signal(0);

  protected readonly isLoading = computed(() => this.phraseRes.isLoading() || this.isUploading());

  protected readonly model = signal<{
    translation: string;
    pronunciation: RecordedAudioFile | null;
  }>({
    translation: '',
    pronunciation: null,
  });
  protected readonly form = form(this.model, (schema) => {
    required(schema.translation, { message: 'Añade una traducción escrita.' });
    minLength(schema.translation, 3, {
      message: 'La traducción debe tener al menos 3 caracteres.',
    });
    required(schema.pronunciation, { message: 'Añade una pronunciación grabada.' });
  });

  readonly phraseRes = rxResource({
    params: computed(() => ({ phraseSetId: this.phraseSetId(), tick: this.nextPhraseTick() })),
    stream: ({ params: { phraseSetId } }) => {
      return this.translationEntryService.getNextPhraseInPhraseSet(phraseSetId);
    },
  });

  readonly phrase = computed<Phrase | null>(() => this.phraseRes.value()?.phrase ?? null);
  constructor() {
    this.destroyRef.onDestroy(() => {
      const currentAudio = this.model().pronunciation;
      if (currentAudio) {
        URL.revokeObjectURL(currentAudio.url);
      }
    });
  }

  protected async goToNextPhrase() {
    this.form().markAsTouched();

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
    this.isUploading.set(true);
    const [_result, error] = await tryCatch(
      this.translationEntryService.submit(entry, pronunciation),
    );
    this.isUploading.set(false);
    if (error) {
      //TODO: add error handling (toast)
    } else {
      this.nextPhraseTick.update((tick) => tick + 1);
      this.form().reset({ translation: '', pronunciation: null });
    }
  }
}
