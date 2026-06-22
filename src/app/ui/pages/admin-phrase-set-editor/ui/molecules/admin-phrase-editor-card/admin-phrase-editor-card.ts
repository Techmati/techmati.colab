import { afterNextRender, ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import type { Phrase } from '@/core/types/phrase.type';
import { clone } from '@/core/utils/clone.util';
import { ZardInputDirective } from '@/shared/components/input';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';
import { form, FormField, required } from '@angular/forms/signals';

@Component({
  selector: 'tm-admin-phrase-editor-card',
  imports: [ZardInputDirective, FormField, FieldErrorAdvice],
  templateUrl: './admin-phrase-editor-card.html',
  styleUrl: './admin-phrase-editor-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseEditorCard {
  readonly phrase = input.required<Phrase>();

  readonly phraseDraft = signal<Phrase>(this.buildEmptyPhrase());

  readonly phraseForm = form(this.phraseDraft, (schema) => {
    required(schema.sourceText, { message: 'El texto fuente no puede estar vacio' });
  });

  constructor() {
    afterNextRender(() => {
      this.phraseDraft.set(clone(this.phrase()));
    });
  }

  private buildEmptyPhrase(): Phrase {
    return {
      phraseSetId: '',
      sourceText: '',
      language: 'spanish_to_nahuatl',
      context: '',
      position: 0,
      createdAt: '',
      id: '',
      updatedAt: '',
    };
  }
}
