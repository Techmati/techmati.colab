import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';

import { AuthCredentials } from '../../../welcome-auth.type';

@Component({
  selector: 'tm-login-form',
  imports: [FormField, ZardButtonComponent, ZardInputDirective],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  readonly isLoading = input.required<boolean>();

  readonly submitted = output<AuthCredentials>();
  readonly errorMessage = output<string | null>();

  protected readonly model = signal<AuthCredentials>({ email: '', password: '' });
  protected readonly form = form(this.model, (schema) => {
    required(schema.email, { message: 'El correo es obligatorio.' });
    email(schema.email, { message: 'Ingresa un correo válido.' });
    required(schema.password, { message: 'La contraseña es obligatoria.' });
    minLength(schema.password, 6, {
      message: 'La contraseña debe tener al menos 6 caracteres.',
    });
  });

  protected submit(event: Event): void {
    event.preventDefault();
    this.errorMessage.emit(null);
    this.form().markAsTouched();

    if (this.form().invalid()) {
      this.errorMessage.emit('Revisa los campos marcados antes de iniciar sesión.');
      return;
    }

    if (!this.isLoading()) {
      this.submitted.emit(this.model());
    }
  }
}
