import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
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
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { tryCatch } from '@/core/utils/try.util';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';
import { injectQuery } from '@tanstack/angular-query-experimental';
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

  readonly phraseSetId = input.required<string>();
  readonly phraseId = signal('');

  protected readonly isUploading = signal(false);
  protected readonly nextPhraseTick = signal(0);
  protected readonly translationId = signal<string | null>(null);

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

  readonly phraseSetRes = injectQuery(() =>
    this.phraseSetService.getPhraseSetById(this.phraseSetId()),
  );

  readonly phrasesMap = computed(() => {
    const phrases = new Map<string, Phrase>();

    if (this.phraseSetRes.isPending()) return phrases;

    const phraseSet = this.phraseSetRes.data()!;
    phraseSet.phrases.forEach((p) => phrases.set(p.id, p));
    return phrases;
  });

  readonly phraseRes = injectQuery(() => {
    const contributorId = this.contributorContext.activeId()!;
    const translationId = this.translationId()!;
    return {
      ...this.translationService.getNextPending(contributorId, translationId ?? ''),
      enabled: !!contributorId && !!translationId,
    };
  });

  readonly phrase = computed<Phrase | null>(() => {
    const phraseId = this.phraseRes.data()?.phraseId;
    if (!phraseId) return null;
    return this.phrasesMap().get(phraseId) ?? null;
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
    effect(() => {
      console.log(this.phrase());
    });
    effect(() => {
      console.log(this.phraseSetRes.data());
    });
  }

  private async initTranslation(): Promise<void> {
    const contributorId = await this.contributorContext.getActiveContributorIdAsync();
    const phraseSetId = this.phraseSetId();
    if (!contributorId || !phraseSetId) return;

    const existing = await firstValueFrom(
      this.translationService.listByContributorObservable(contributorId, {
        filter: 'in_progress',
        page: 1,
        size: 1,
      }),
    );

    const match = existing.data.find((t) => t.phraseSetId === phraseSetId && t.inProgress);
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
    const contributorId = await this.contributorContext.getActiveContributorIdAsync();
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
