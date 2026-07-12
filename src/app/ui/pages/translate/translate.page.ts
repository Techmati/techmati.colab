import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { TranslationService } from '@/core/service/translation/translation.service';
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
import { firstValueFrom } from 'rxjs';
import { form, FormField, minLength, required } from '@angular/forms/signals';

import { tryCatch } from '@/core/utils/try.util';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';
import { BatchProgressPanel } from './ui/organisms/batch-progress-panel/batch-progress-panel';
import { BottomActionBar } from './ui/organisms/bottom-action-bar/bottom-action-bar';
import { PronunciationRecorder } from './ui/organisms/pronunciation-recorder/pronunciation-recorder';
import { SourceTextPanel } from './ui/organisms/source-text-panel/source-text-panel';
import { TaskTopBar } from './ui/organisms/task-top-bar/task-top-bar';
import { TranslationTextarea } from './ui/organisms/translation-textarea/translation-textarea';
import { TranslationTaskSkeleton } from './ui/organisms/translation-task-skeleton/translation-task-skeleton';

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
    TranslationTaskSkeleton,
    FieldErrorAdvice,
  ],
  templateUrl: './translate.page.html',
  styleUrl: './translate.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslatePage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translationService = inject(TranslationService);
  private readonly phraseSetsService = inject(PhraseSetsService);
  private readonly contributorContext = inject(ContributorContextService);

  readonly phraseSetId = input.required<string>();
  readonly phraseId = signal('');

  protected readonly isUploading = signal(false);
  protected readonly nextPhraseTick = signal(0);
  protected readonly translationId = signal<string | null>(null);

  protected readonly isLoading = computed(
    () => this.phraseRes.isLoading() || this.isUploading(),
  );

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
    params: computed(() => ({
      contributorId: this.translationId() ?? '',
      translationId: this.translationId() ?? '',
      tick: this.nextPhraseTick(),
    })),
    stream: ({ params }) => {
      if (!params.contributorId || !params.translationId) {
        return this.translationService.getNextPending('', '');
      }
      return this.translationService.getNextPending(params.contributorId, params.translationId);
    },
  });

  readonly phrase = computed<Phrase | null>(() => {
    const phraseId = this.phraseRes.value()?.phraseId;
    if (!phraseId) return null;
    return { id: phraseId, phraseSetId: this.phraseSetId(), sourceText: '', position: 0, createdAt: '' };
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      const currentAudio = this.model().pronunciation;
      if (currentAudio) {
        URL.revokeObjectURL(currentAudio.url);
      }
    });

    effect(() => {
      void this.initTranslation();
    });
  }

  private async initTranslation(): Promise<void> {
    const contributorId = await this.contributorContext.getActiveContributorId();
    const phraseSetId = this.phraseSetId();
    if (!contributorId || !phraseSetId) return;

    const existing = await firstValueFrom(
      this.translationService.listByContributor(contributorId, {
        filter: 'in_progress',
        page: 1,
        size: 1,
      }),
    );

    const match = existing.data.find(
      (t) => t.phraseSetId === phraseSetId && t.inProgress,
    );
    if (match) {
      this.translationId.set(match.id);
      return;
    }

    const created = await firstValueFrom(
      this.translationService.create(contributorId, {
        phraseSetId,
        dialectId: null,
      }),
    );
    this.translationId.set(created.id);
  }

  protected async goToNextPhrase() {
    this.form().markAsTouched();

    if (this.form().invalid()) {
      return;
    }

    const phrase = this.phrase();
    const pronunciation = this.model().pronunciation?.file ?? null;
    const translation = this.model().translation;
    const contributorId = await this.contributorContext.getActiveContributorId();
    const translationId = this.translationId();
    if (!phrase || !pronunciation || !contributorId || !translationId) {
      return;
    }

    this.isUploading.set(true);
    const [_result, error] = await tryCatch(
      this.translationService.submitEntry(
        contributorId,
        translationId,
        { phraseId: phrase.id, translation },
        pronunciation,
      ),
    );
    this.isUploading.set(false);
    if (error) {
      console.error('Error submitting translation entry:', error);
    } else {
      this.nextPhraseTick.update((tick) => tick + 1);
      this.form().reset({ translation: '', pronunciation: null });
    }
  }
}
