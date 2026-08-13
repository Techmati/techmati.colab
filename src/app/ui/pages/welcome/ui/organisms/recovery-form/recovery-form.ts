import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { form, FormField, pattern, required } from '@angular/forms/signals';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';

export interface RecoveryCredentials {
  recoveryCode: string;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Component({
  selector: 'tm-recovery-form',
  imports: [FormField, ZardButtonComponent, ZardInputDirective],
  templateUrl: './recovery-form.html',
  styleUrl: './recovery-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryForm {
  readonly isLoading = input.required<boolean>();

  readonly submitted = output<{ recoveryCode: string }>();
  readonly errorMessage = output<string | null>();

  protected readonly model = signal<{ recoveryCode: string }>({ recoveryCode: '' });
  protected readonly form = form(this.model, (schema) => {
    required(schema.recoveryCode, { message: 'El código de recuperación es obligatorio.' });
    pattern(schema.recoveryCode, UUID_PATTERN, {
      message: 'Ingresa un código de recuperación válido.',
    });
  });

  protected submit(event: Event): void {
    event.preventDefault();
    this.errorMessage.emit(null);
    this.form().markAsTouched();

    if (this.form().invalid()) {
      this.errorMessage.emit('Revisa el código de recuperación antes de continuar.');
      return;
    }

    if (!this.isLoading()) {
      this.submitted.emit({ recoveryCode: this.model().recoveryCode.trim() });
    }
  }
}
