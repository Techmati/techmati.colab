import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  viewChild,
  viewChildren,
} from '@angular/core';
import Sortable from 'sortablejs';

import type { Phrase } from '@/core/types/phrase.type';

import { clone } from '@/core/utils/clone.util';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { NewPhraseDraft, PhraseDraft } from '../../../core/types/phrase-derivations.type';
import { AdminPhraseEditorCard } from '../../molecules/admin-phrase-editor-card/admin-phrase-editor-card';

@Component({
  selector: 'tm-admin-phrase-set-editor-phrases-panel',
  imports: [AdminPhraseEditorCard, ZardSkeletonComponent, ZardEmptyComponent, ZardButtonComponent],
  templateUrl: './admin-phrase-set-editor-phrases-panel.html',
  styleUrl: './admin-phrase-set-editor-phrases-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorPhrasesPanel {
  readonly cachedPhrases = input.required<readonly Phrase[]>();
  readonly phraseSetId = input.required<string>();
  readonly isPending = input.required<boolean>();

  private readonly phrasesList = viewChild.required<ElementRef<HTMLElement>>('phrasesList');
  private readonly phraseEditorCards = viewChildren(AdminPhraseEditorCard);

  private readonly destroyRef = inject(DestroyRef);

  readonly phrasesDrafts = model<PhraseDraft[]>([]);
  readonly invalid = computed(
    () =>
      this.phraseEditorCards().length === 0 ||
      this.phraseEditorCards().some((card) => card.invalid()),
  );

  private newPhraseDraftCount = 0;

  constructor() {
    afterNextRender(() => {
      const sortable = Sortable.create(this.phrasesList().nativeElement, {
        animation: 180,
        handle: '.admin-phrase-editor-card__drag-handle',
        ghostClass: 'admin-phrase-editor-card--ghost',
        chosenClass: 'admin-phrase-editor-card--chosen',
        dragClass: 'admin-phrase-editor-card--dragging',
        onEnd: (event) => this.reorderPhrases(event.oldIndex, event.newIndex),
      });

      this.destroyRef.onDestroy(() => sortable.destroy());
    });

    effect(() => {
      const cachedPhrases = this.cachedPhrases();

      if (!this.isPending()) {
        this.phrasesDrafts.set(this.orderCachedPhrases(cachedPhrases));
      }
    });
  }

  protected deletePhraseDraft(draftId: string): void {
    this.phrasesDrafts.update((drafts) => {
      const next = drafts.filter((draft) => draft.draftId !== draftId);
      return this.withVisualPositions(next);
    });
  }

  protected addNewPhrase() {
    this.phrasesDrafts.update((drafts) =>
      this.withVisualPositions([...drafts, this.buildEmptyPhrase()]),
    );
  }

  protected updatePhraseDraft(draftId: string, phrase: PhraseDraft): void {
    this.phrasesDrafts.update((drafts) =>
      this.withVisualPositions(
        drafts.map((draft) => (draft.draftId === draftId ? { ...phrase, draftId } : draft)),
      ),
    );
  }

  private reorderPhrases(oldIndex: number | undefined, newIndex: number | undefined): void {
    if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
      return;
    }

    this.phrasesDrafts.update((drafts) => {
      const next = [...drafts];
      const [movedPhrase] = next.splice(oldIndex, 1);

      if (!movedPhrase) {
        return drafts;
      }

      next.splice(newIndex, 0, movedPhrase);

      return this.withVisualPositions(next);
    });
  }

  private orderCachedPhrases(phrases: readonly Phrase[]): PhraseDraft[] {
    return this.withVisualPositions(
      phrases
        .map((phrase) => ({ ...clone(phrase), draftId: `cached-phrase-${phrase.id}` }))
        .sort((a, b) => a.position - b.position),
    );
  }

  private withVisualPositions(phrases: readonly PhraseDraft[]): PhraseDraft[] {
    return phrases.map((phrase, index) => ({ ...phrase, position: index + 1 }));
  }

  private buildEmptyPhrase(): NewPhraseDraft {
    return {
      draftId: `new-phrase-${this.newPhraseDraftCount++}`,
      phraseSetId: this.phraseSetId(),
      sourceText: '',
      language: 'spanish_to_nahuatl',
      context: '',
      position: this.phrasesDrafts().length + 1,
    };
  }
}
