import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';

import { GuestService } from '@/core/service/guest/guest.service';
import { SignUpCredentials } from '../../../welcome-auth.type';

@Component({
  selector: 'tm-signup-form',
  imports: [FormField, ZardButtonComponent, ZardInputDirective],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupForm {
  readonly isLoading = input.required<boolean>();
  readonly fullName = input<string | null>();

  readonly submitted = output<SignUpCredentials>();
  readonly errorMessage = output<string | null>();

  protected readonly model = linkedSignal<SignUpCredentials>(() => ({
    fullName: this.fullName() ?? '',
    username: '',
    email: '',
    password: '',
  }));

  protected readonly form = form(this.model, (schema) => {
    required(schema.fullName, { message: 'El nombre completo es obligatorio.' });
    minLength(schema.fullName, 2, {
      message: 'El nombre completo debe tener al menos 2 caracteres.',
    });
    required(schema.username, { message: 'El nombre de usuario es obligatorio.' });
    minLength(schema.username, 3, {
      message: 'El nombre de usuario debe tener al menos 3 caracteres.',
    });
    required(schema.email, { message: 'El correo es obligatorio.' });
    email(schema.email, { message: 'Ingresa un correo válido.' });
    required(schema.password, { message: 'La contraseña es obligatoria.' });
    minLength(schema.password, 6, {
      message: 'La contraseña debe tener al menos 6 caracteres.',
    });
  });

  private readonly guestService = inject(GuestService);

  protected submit(event: Event): void {
    event.preventDefault();
    this.errorMessage.emit(null);
    this.form().markAsTouched();

    if (this.form().invalid()) {
      this.errorMessage.emit('Revisa los campos marcados antes de crear tu cuenta.');
      return;
    }

    if (!this.isLoading()) {
      this.submitted.emit(this.model());
    }
  }
}
