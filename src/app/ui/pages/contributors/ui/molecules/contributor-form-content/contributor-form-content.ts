import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';

import { Z_MODAL_DATA } from '@/shared/components/dialog';
import { ZardInputDirective } from '@/shared/components/input';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';

import type { Contributor } from '@/core/types/contributor.type';
import type { LanguageVariant } from '@/core/types/language-variant.type';
import { ContributorVariantsInput } from '../../molecules/contributor-variants-input/contributor-variants-input';

export interface ContributorFormModel {
  id: string;
  alias: string;
  variants: LanguageVariant[];
}

@Component({
  selector: 'tm-contributor-form-content',
  imports: [ZardInputDirective, FormField, FieldErrorAdvice, ContributorVariantsInput],
  templateUrl: './contributor-form-content.html',
  styleUrl: './contributor-form-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorFormContent {
  protected readonly data: { contributor?: Contributor | null } = inject(Z_MODAL_DATA) ?? {};

  readonly model = signal<ContributorFormModel>({
    id: this.data.contributor?.id ?? '',
    alias: this.data.contributor?.alias ?? '',
    variants: [...(this.data.contributor?.variants ?? [])],
  });

  readonly form = form(this.model, (schema) => {
    required(schema.alias, { message: 'El alias es obligatorio.' });
    maxLength(schema.alias, 100, { message: 'El alias no puede exceder 100 caracteres.' });
    minLength(schema.variants, 1, { message: 'Debe tener al menos una variante.' });
  });

  getValue() {
    return this.model();
  }

  validateAndSave(): ContributorFormModel | false {
    this.form().markAsTouched();

    if (this.form().invalid()) {
      return false;
    }

    return this.getValue();
  }
}
