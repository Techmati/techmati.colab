import { Location } from '@angular/common';
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

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { Phrase } from '@/core/types/phrase.type';
import { type RecordedAudioFile } from '@/core/utils/audio-recorder.util';
import { tryCatch } from '@/core/utils/try.util';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { BatchProgressPanel } from './ui/organisms/batch-progress-panel/batch-progress-panel';
import { BottomActionBar } from './ui/organisms/bottom-action-bar/bottom-action-bar';
import {
  DialectSelectionContent,
  type DialectSelectionData,
} from './ui/organisms/dialect-selection-content/dialect-selection-content';
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
  private readonly dialogService = inject(ZardAlertDialogService);
  private readonly location = inject(Location);

  readonly phraseSetId = input.required<string>();

  protected readonly isUploading = signal(false);
  protected readonly nextPhraseTick = signal(0);
  protected readonly translationId = signal<string | null>(null);
  protected readonly dialogResolved = signal(false);
  protected readonly dialogBusy = signal(false);

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
      void this.showDialectDialog();
    });
  }

  private async showDialectDialog(): Promise<void> {
    const contributorId = this.contributorContext.activeId();
    const phraseSetId = this.phraseSetId();
    if (!contributorId || !phraseSetId) return;

    if (this.dialogResolved()) return;

    // Check for existing in-progress translation
    const existing = await firstValueFrom(
      this.translationService.listByContributorObservable(contributorId, {
        filter: 'in_progress',
        page: 1,
        size: 1,
      }),
    );

    const match = existing.data.find((t) => t.phraseSetId === phraseSetId && t.inProgress);
    const existingDialectId = match?.dialect?.id ?? null;

    this.dialogService.create<DialectSelectionContent>({
      zTitle: 'Iniciar traducción',
      zContent: DialectSelectionContent,
      zData: { phraseSetId },
      zCancelText: 'Volver',
      zOkText: match ? 'Continuar' : 'Iniciar',
      zMaskClosable: false,
      zWidth: '350px',
      zOnOk: (instance) => {
        if (this.dialogBusy()) return false;
        this.dialogBusy.set(true);

        if (match) {
          // Resume existing translation
          this.translationId.set(match.id);
          this.dialogResolved.set(true);
          return;
        }

        void this.handleNewTranslation(instance, contributorId, phraseSetId);
        return false;
      },
      zOnCancel: () => {
        this.location.back();
      },
    });
  }

  private async handleNewTranslation(
    instance: DialectSelectionContent,
    contributorId: string,
    phraseSetId: string,
  ): Promise<void> {
    const dialectId = instance.getSelectedDialectId();

    const [created, error] = await tryCatch(
      firstValueFrom(
        this.translationService.create(contributorId, {
          phraseSetId,
          dialectId,
        }),
      ),
    );

    this.dialogBusy.set(false);

    if (error) {
      return;
    }

    this.translationId.set(created!.id);
    this.dialogResolved.set(true);
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