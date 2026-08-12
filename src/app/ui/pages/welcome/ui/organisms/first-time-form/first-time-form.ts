import { LanguageVariant } from '@/core/types/language-variant.type';
import { ZardButtonComponent } from '@/shared/components/button';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';
import { Component, input, output, signal } from '@angular/core';
import { form, FormField, maxLength, required } from '@angular/forms/signals';
import { FirstTimeSetupData } from '../../../core/types/first-time-setup-data.type';
import { ContributorVariantsInput } from '../../molecules/contributor-variants-input/contributor-variants-input';

export interface ContributorFormModel {
  alias: string;
  variants: LanguageVariant[];
}

@Component({
  selector: 'tm-first-time-form',
  imports: [ContributorVariantsInput, FieldErrorAdvice, FormField, ZardButtonComponent],
  templateUrl: './first-time-form.html',
  styles: ``,
})
export class FirstTimeForm {
  readonly isLoading = input.required<boolean>();
  readonly submitted = output<FirstTimeSetupData>();
  readonly errorMessage = output<string | null>();

  readonly model = signal<ContributorFormModel>({
    alias: '',
    variants: [],
  });

  readonly form = form(this.model, (schema) => {
    required(schema.alias, { message: 'El alias es obligatorio.' });
    maxLength(schema.alias, 100, { message: 'El alias no puede exceder 100 caracteres.' });
  });

  getValue() {
    return this.model();
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.errorMessage.emit(null);
    this.form().markAsTouched();

    if (this.form().invalid()) {
      this.errorMessage.emit('Revisa los campos marcados antes de ingresar.');
      return;
    }

    if (!this.isLoading()) {
      this.submitted.emit(this.model());
    }
  }
}
