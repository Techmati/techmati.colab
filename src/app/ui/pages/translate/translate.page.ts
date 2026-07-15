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
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { Phrase } from '@/core/types/phrase.type';
import { type RecordedAudioFile } from '@/core/utils/audio-recorder.util';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';
import { BatchProgressPanel } from './ui/organisms/batch-progress-panel/batch-progress-panel';
import { BottomActionBar } from './ui/organisms/bottom-action-bar/bottom-action-bar';
import { PronunciationRecorder } from './ui/organisms/pronunciation-recorder/pronunciation-recorder';
import { SourceTextPanel } from './ui/organisms/source-text-panel/source-text-panel';
import { TaskTopBar } from './ui/organisms/task-top-bar/task-top-bar';
import { TranslationTaskSkeleton } from './ui/organisms/translation-task-skeleton/translation-task-skeleton';
import { TranslationTextarea } from './ui/organisms/translation-textarea/translation-textarea';

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
  private readonly phraseSetService = inject(PhraseSetsService);
  private readonly contributorContext = inject(ContributorContextService);

  readonly translationId = input.required<string>();

  protected readonly isUploading = signal(false);

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

  readonly translationRes = injectQuery(() => {
    const contributorId = this.contributorContext.activeId()!;
    const translationId = this.translationId();
    return {
      ...this.translationService.findById(contributorId, translationId),
      enabled: !!contributorId && !!translationId,
    };
  });

  readonly phraseSetRes = injectQuery(() => {
    const translation = this.translationRes.data()!;
    return {
      ...this.phraseSetService.getPhraseSetById(translation.phraseSetId),
      enabled: !!translation,
    };
  });

  readonly phrasesMap = computed(() => {
    const phrases = new Map<string, Phrase>();

    if (this.phraseSetRes.isPending()) return phrases;

    const phraseSet = this.phraseSetRes.data()!;
    phraseSet.phrases.forEach((p) => phrases.set(p.id, p));
    return phrases;
  });

  readonly nextPhraseRes = injectQuery(() => {
    const contributorId = this.contributorContext.activeId()!;
    const translationId = this.translationId();
    return {
      ...this.translationService.getNextPending(contributorId, translationId ?? ''),
      enabled: !!contributorId && !!translationId,
    };
  });

  readonly nextPhrase = computed<Phrase | null>(() => {
    const phraseId = this.nextPhraseRes.data()?.phraseId;
    if (!phraseId) return null;
    return this.phrasesMap().get(phraseId) ?? null;
  });

  protected readonly isLoading = computed(
    () =>
      this.translationRes.isPending() ||
      this.phraseSetRes.isPending() ||
      this.nextPhraseRes.isLoading() ||
      this.isUploading(),
  );

  readonly submitTranslationMutation = injectMutation(() => ({
    ...this.translationService.submitEntry(),
    onSuccess: () => {
      this.isUploading.set(false);
      this.nextPhraseRes.refetch();
      this.translationRes.refetch();
      this.form().reset({ translation: '', pronunciation: null });
    },
    onError: (error) => {
      console.error('Error submitting translation entry:', error);
    },
  }));

  constructor() {
    this.destroyRef.onDestroy(() => {
      const currentAudio = this.model().pronunciation;
      if (currentAudio) {
        URL.revokeObjectURL(currentAudio.url);
      }
    });

    effect(() => {
      console.log('Current phrase:', this.nextPhrase());
      console.log('Current translation:', this.translationRes.data());
    });
  }

  protected async goToNextPhrase() {
    this.form().markAsTouched();

    if (this.form().invalid()) {
      return;
    }

    const phrase = this.nextPhrase();
    const audio = this.model().pronunciation?.file ?? null;
    const translation = this.model().translation;
    const contributorId = await this.contributorContext.getActiveContributorIdAsync();
    const translationId = this.translationId();
    if (!phrase || !audio || !contributorId || !translationId) {
      return;
    }

    this.isUploading.set(true);
    this.submitTranslationMutation.mutate({
      contributorId,
      translationId,
      payload: { phraseId: phrase.id, translation },
      audio,
    });
  }
}
