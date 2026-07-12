import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';

import { PhraseSet } from '@/core/types/phrase-set.type';
import { ZardToastComponent } from '@/shared/components/toast';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { ExternalToast, toast } from 'ngx-sonner';
import { AdminPhraseSetService } from '../../../core/service/admin-phrase-set/admin-phrase-set.service';
import { EMPTY_PHRASE_SET } from './core/defaults/empty-phrase-set.default';
import { PhraseDraft, PhraseDraftPayload } from './core/types/phrase-derivations.type';
import {
  NewPhraseSetDraft,
  PhraseSetCreatePayload,
  PhraseSetDraft,
  PhraseSetUpdatePayload,
} from './core/types/phrase-set-derivations.type';
import { AdminPhraseSetEditorActions } from './ui/organisms/admin-phrase-set-editor-actions/admin-phrase-set-editor-actions';
import { AdminPhraseSetEditorInfoPanel } from './ui/organisms/admin-phrase-set-editor-info-panel/admin-phrase-set-editor-info-panel';
import { AdminPhraseSetEditorPhrasesPanel } from './ui/organisms/admin-phrase-set-editor-phrases-panel/admin-phrase-set-editor-phrases-panel';
import { AdminPhraseSetEditorTopBar } from './ui/organisms/admin-phrase-set-editor-top-bar/admin-phrase-set-editor-top-bar';

@Component({
  selector: 'tm-admin-phrase-set-editor-page',
  imports: [
    AdminPhraseSetEditorTopBar,
    AdminPhraseSetEditorInfoPanel,
    AdminPhraseSetEditorPhrasesPanel,
    AdminPhraseSetEditorActions,
    ZardToastComponent,
  ],
  templateUrl: './admin-phrase-set-editor.page.html',
  styleUrl: './admin-phrase-set-editor.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorPage {
  readonly inputPhraseSetId = input.required<string>({ alias: 'phraseSetId' });
  readonly phraseSetId = linkedSignal(() => this.inputPhraseSetId());

  private readonly adminPhraseSetService = inject(AdminPhraseSetService);
  private readonly location = inject(Location);

  readonly isCreating = computed(() => this.phraseSetId() === 'new' && !this.created());
  readonly created = signal(false);

  readonly phraseSetQuery = injectQuery(() => ({
    ...this.adminPhraseSetService.findByIdQuery(this.phraseSetId()),
    enabled: !this.isCreating(),
  }));

  readonly phraseSet = computed(() => this.phraseSetQuery.data() ?? null);

  readonly phraseSetPhrasesQuery = injectQuery(() => ({
    ...this.adminPhraseSetService.findPhrasesQuery(this.phraseSetId(), { page: 1, size: 100 }),
    enabled: !this.isCreating(),
  }));

  readonly phrases = computed(() => this.phraseSetPhrasesQuery.data()?.data ?? []);

  readonly deleteMutation = injectMutation(() => ({
    ...this.adminPhraseSetService.delete(this.phraseSetId()),
    onSuccess: () => this.onDeleteSuccess(),
    onError: () => this.onDeleteError(),
  }));

  readonly deleteLoading = computed(() => this.deleteMutation.isPending());

  readonly deleteDisabled = computed(() => this.isCreating());

  readonly phraseSetUpdateMutation = injectMutation(() => ({
    ...this.adminPhraseSetService.updateMutation(this.phraseSetId()),
    onSuccess: (data) => this.onUpdateSuccess(data),
    onError: () => this.onUpdateError(this.buildUpdatePayload()),
  }));

  readonly phraseSetCreateMutation = injectMutation(() => ({
    ...this.adminPhraseSetService.createMutation(),
    onSuccess: (data) => this.onCreationSuccess(data),
    onError: () => this.onCreationError(this.buildCreatePayload()),
  }));

  readonly saveLoading = computed(
    () => this.phraseSetUpdateMutation.isPending() || this.phraseSetCreateMutation.isPending(),
  );

  readonly phraseSetDraft = signal<PhraseSetDraft>(EMPTY_PHRASE_SET);
  readonly phrasesDrafts = signal<PhraseDraft[]>([]);

  readonly baseToastConfig: ExternalToast = {
    position: 'bottom-right',
    unstyled: true,
    class:
      'border border-border-subtle bg-card flex gap-2 p-3 items-center justify-center rounded-sm',
  };

  protected save() {
    console.log(this.isCreating());
    if (this.isCreating()) {
      this.phraseSetCreateMutation.mutate(this.buildCreatePayload());
      console.log('Creating new phrase set', this.buildCreatePayload());
      return;
    }

    this.phraseSetUpdateMutation.mutate(this.buildUpdatePayload());
  }

  protected discard(): void {
    this.location.back();
  }

  protected delete(): void {
    this.deleteMutation.mutate();
  }

  private buildUpdatePayload(): PhraseSetUpdatePayload {
    return {
      ...this.phraseSetDraft(),
      phrases: this.buildPhrasePayloads(),
    };
  }

  private buildCreatePayload(): PhraseSetCreatePayload {
    const phraseSet = this.toNewPhraseSetDraft(this.phraseSetDraft());

    return {
      ...phraseSet,
      phrases: this.buildPhrasePayloads(),
    };
  }

  private buildPhrasePayloads(): PhraseDraftPayload[] {
    return this.phrasesDrafts().map(({ draftId: _draftId, ...phrase }) => phrase);
  }

  private toNewPhraseSetDraft(phraseSet: PhraseSetDraft): NewPhraseSetDraft {
    const { title, description, language, published } = phraseSet;

    return {
      title,
      description,
      language,
      published,
    };
  }
  private onUpdateSuccess(phraseSet: PhraseSet): void {
    const description = phraseSet.published
      ? 'Cambios guardados, el set se encuentre publicado y listo para hacer contribuciones'
      : 'Cambios guardados, pero el set de frases no se encuentra publicado. Los usuarios no podrán acceder a él hasta que lo publiques.';
    toast.success(`Cambios en el set de frases "${phraseSet.title}" guardados con éxito`, {
      description,
      ...this.baseToastConfig,
    });
  }

  private onCreationSuccess(phraseSet: PhraseSet): void {
    const description = phraseSet.published
      ? 'Ahora los usuarios pueden acceder a este set de frases y empezar a contribuir.'
      : 'El set de frases se ha creado correctamente, pero no está publicado. Los usuarios no podrán acceder a él hasta que lo publiques.';
    toast.success(`Set de frases "${phraseSet.title}" creado con éxito`, {
      description,
      ...this.baseToastConfig,
    });
    this.phraseSetId.set(phraseSet.id);
    this.created.set(true);
  }

  private onDeleteSuccess(): void {
    toast.success('Set de frases eliminado con éxito', {
      description: 'El set de frases ha sido eliminado correctamente.',
      ...this.baseToastConfig,
    });
    this.location.back();
  }

  private onUpdateError(phraseSet: PhraseSetUpdatePayload): void {
    toast.error(`No se pudieron guardar los cambios de "${phraseSet.title}"`, {
      description:
        'Ocurrió un problema al actualizar el set de frases. Revisa tu conexión e intenta guardar de nuevo.',
      ...this.baseToastConfig,
    });
  }

  private onCreationError(phraseSet: PhraseSetCreatePayload): void {
    toast.error(`No se pudo crear el set de frases "${phraseSet.title}"`, {
      description:
        'Ocurrió un problema al crear el set de frases. Revisa la información e intenta guardar de nuevo.',
      ...this.baseToastConfig,
    });
  }

  private onDeleteError(): void {
    toast.error('No se pudo eliminar el set de frases', {
      description:
        'Ocurrió un problema al eliminar el set de frases. Revisa tu conexión e intenta eliminar de nuevo.',
      ...this.baseToastConfig,
    });
  }
}
