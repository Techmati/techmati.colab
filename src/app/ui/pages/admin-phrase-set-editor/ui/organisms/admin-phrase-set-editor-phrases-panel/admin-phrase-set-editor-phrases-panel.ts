import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import Sortable from 'sortablejs';

import type { Phrase } from '@/core/types/phrase.type';

import { clone } from '@/core/utils/clone.util';
import { AdminPhraseEditorCard } from '../../molecules/admin-phrase-editor-card/admin-phrase-editor-card';

type NewPhrase = Omit<Phrase, 'id' | 'createdAt' | 'updatedAt'>;

@Component({
  selector: 'tm-admin-phrase-set-editor-phrases-panel',
  imports: [AdminPhraseEditorCard],
  templateUrl: './admin-phrase-set-editor-phrases-panel.html',
  styleUrl: './admin-phrase-set-editor-phrases-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorPhrasesPanel {
  private readonly destroyRef = inject(DestroyRef);
  private readonly phrasesList = viewChild.required<ElementRef<HTMLElement>>('phrasesList');

  readonly cachedPhrases = input.required<readonly Phrase[]>();
  readonly phraseSetId = input.required<string>();
  readonly phrasesDrafts = signal<Phrase[]>([]);

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

      if (this.phrasesDrafts().length === 0 && cachedPhrases.length > 0) {
        this.phrasesDrafts.set(this.orderCachedPhrases(cachedPhrases));
      }
    });
  }

  protected print() {
    console.log(this.phrasesDrafts().map(({ sourceText, position }) => [sourceText, position]));
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

  private orderCachedPhrases(phrases: readonly Phrase[]): Phrase[] {
    return this.withVisualPositions(
      phrases.map((phrase) => clone(phrase)).sort((a, b) => a.position - b.position),
    );
  }

  private withVisualPositions(phrases: readonly Phrase[]): Phrase[] {
    return phrases.map((phrase, index) => ({ ...phrase, position: index + 1 }));
  }

  private buildEmptyPhrase(): NewPhrase {
    return {
      phraseSetId: this.phraseSetId(),
      sourceText: '',
      language: 'spanish_to_nahuatl',
      context: '',
      position: this.phrasesDrafts().length + 1,
    };
  }
}
