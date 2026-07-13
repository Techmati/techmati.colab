import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';

import { ZardInputDirective } from '@/shared/components/input';
import { Z_MODAL_DATA } from '@/shared/components/dialog';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';

import type { Contributor } from '@/core/types/contributor.type';
import { ContributorVariantsInput } from '../../molecules/contributor-variants-input/contributor-variants-input';

export interface ContributorFormModel {
  name: string;
  variants: string[];
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
    name: this.data.contributor?.fullName ?? '',
    variants: [...(this.data.contributor?.variants.map((v) => v.label) ?? [])],
  });

  readonly form = form(this.model, (schema) => {
    required(schema.name, { message: 'El nombre es obligatorio.' });
    maxLength(schema.name, 100, { message: 'El nombre no puede exceder 100 caracteres.' });
    minLength(schema.variants, 1, { message: 'Debe tener al menos una variante.' });
  });

  getValue(): ContributorFormModel {
    return this.model();
  }

  /** @internal Used by zOnOk callback */
  validateAndSave(): ContributorFormModel | false {
    this.form().markAsTouched();

    if (this.form().invalid()) {
      return false;
    }

    return this.getValue();
  }
}