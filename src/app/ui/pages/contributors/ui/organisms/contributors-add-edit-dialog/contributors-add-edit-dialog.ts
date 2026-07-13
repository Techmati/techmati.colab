import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  output,
  signal,
} from '@angular/core';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';

import type { Contributor } from '@/core/types/contributor.type';
import { ContributorVariantsInput } from '../../molecules/contributor-variants-input/contributor-variants-input';

export interface ContributorFormModel {
  name: string;
  variants: string[];
}

@Component({
  selector: 'tm-contributors-add-edit-dialog',
  imports: [ZardButtonComponent, ZardInputDirective, FieldErrorAdvice, FormField, ContributorVariantsInput],
  templateUrl: './contributors-add-edit-dialog.html',
  styleUrl: './contributors-add-edit-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsAddEditDialog {
  readonly contributor = model<Contributor | null>(null);
  readonly open = model(false);
  readonly saved = output<ContributorFormModel>();
  readonly dismissed = output<void>();

  protected readonly isEdit = computed(() => !!this.contributor());

  protected readonly model = signal<ContributorFormModel>({
    name: this.contributor()?.fullName ?? '',
    variants: [...(this.contributor()?.variants.map((v) => v.label) ?? [])],
  });

  protected readonly form = form(this.model, (schema) => {
    required(schema.name, { message: 'El nombre es obligatorio.' });
    maxLength(schema.name, 100, { message: 'El nombre no puede exceder 100 caracteres.' });
    minLength(schema.variants, 1, { message: 'Debe tener al menos una variante.' });
  });

  protected onSave(): void {
    this.form().markAsTouched();

    if (this.form().invalid()) {
      return;
    }

    this.saved.emit(this.model());
  }

  protected onDismiss(): void {
    this.open.set(false);
    this.dismissed.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement)?.classList.contains('dialog-backdrop')) {
      this.onDismiss();
    }
  }
}