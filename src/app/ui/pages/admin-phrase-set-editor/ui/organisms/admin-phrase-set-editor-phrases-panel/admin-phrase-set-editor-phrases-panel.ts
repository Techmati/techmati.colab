import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import Sortable from 'sortablejs';

import type { Phrase } from '@/core/types/phrase.type';

import { clone } from '@/core/utils/clone.util';
import { AdminPhraseEditorCard } from '../../molecules/admin-phrase-editor-card/admin-phrase-editor-card';

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

  readonly phrases = input.required<readonly Phrase[]>();
  readonly phrasesDrafts = signal<readonly Phrase[]>([]);

  protected readonly orderedPhrases = linkedSignal<readonly Phrase[], Phrase[]>({
    source: this.phrases,
    computation: (phrases) => this.orderInputPhrases(phrases),
  });

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
      console.log('Phrases updated, resetting drafts if empty');
      if (this.phrasesDrafts().length === 0 && this.phrases.length > 0) {
        this.phrasesDrafts.set(this.phrases().map((phrase) => clone(phrase)));
      }
    });
  }

  private reorderPhrases(oldIndex: number | undefined, newIndex: number | undefined): void {
    if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
      return;
    }

    this.orderedPhrases.update((phrases) => {
      const next = [...phrases];
      const [movedPhrase] = next.splice(oldIndex, 1);

      if (!movedPhrase) {
        return phrases;
      }

      next.splice(newIndex, 0, movedPhrase);

      return this.withVisualPositions(next);
    });
  }

  private orderInputPhrases(phrases: readonly Phrase[]): Phrase[] {
    return this.withVisualPositions([...phrases].sort((a, b) => a.position - b.position));
  }

  private withVisualPositions(phrases: readonly Phrase[]): Phrase[] {
    return phrases.map((phrase, index) => ({ ...phrase, position: index + 1 }));
  }
}
