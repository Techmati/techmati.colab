import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';

import type { Phrase } from '@/core/types/phrase.type';
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
  readonly phraseChange = output<Phrase>();
  readonly phrase = model.required<Phrase>();

  readonly phraseForm = form(this.phrase, (schema) => {
    required(schema.sourceText, { message: 'El texto fuente no puede estar vacio' });
  });
}
