import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';

import { ZardInputDirective } from '@/shared/components/input';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';
import { form, FormField, required } from '@angular/forms/signals';
import { PhraseDraft } from '../../../core/types/phrase-derivations.type';

@Component({
  selector: 'tm-admin-phrase-editor-card',
  imports: [ZardInputDirective, FormField, FieldErrorAdvice],
  templateUrl: './admin-phrase-editor-card.html',
  styleUrl: './admin-phrase-editor-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseEditorCard {
  readonly phrase = model.required<PhraseDraft>();
  readonly delete = output<string>();

  readonly phraseForm = form(this.phrase, (schema) => {
    required(schema.sourceText, { message: 'El texto fuente no puede estar vacio' });
  });
}
