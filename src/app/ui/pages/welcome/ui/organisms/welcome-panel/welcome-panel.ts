import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';

export interface AuthCredentials {
  email: string;
  password: string;
}

type AuthMode = 'sign-in' | 'sign-up';

@Component({
  selector: 'tm-welcome-panel',
  imports: [NgOptimizedImage, FormField, ZardButtonComponent, ZardInputDirective],
  templateUrl: './welcome-panel.html',
  styleUrl: './welcome-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePanel {
  readonly isLoading = input.required<boolean>();
  readonly error = input<string | null>();
  readonly success = input<string | null>();

  readonly googleSignInRequested = output();
  readonly passwordSignInRequested = output<AuthCredentials>();
  readonly passwordSignUpRequested = output<AuthCredentials>();
  readonly modeChanged = output<AuthMode>();

  protected readonly mode = signal<AuthMode>('sign-in');
  protected readonly model = signal<AuthCredentials>({ email: '', password: '' });
  protected readonly form = form(this.model, (schema) => {
    required(schema.email, { message: 'El correo es obligatorio.' });
    email(schema.email, { message: 'Ingresa un correo válido.' });
    required(schema.password, { message: 'La contraseña es obligatoria.' });
    minLength(schema.password, 6, {
      message: 'La contraseña debe tener al menos 6 caracteres.',
    });
  });
  protected readonly isSignIn = computed(() => this.mode() === 'sign-in');

  protected readonly logoUrl = '/res/brand.jpg';

  protected selectMode(mode: AuthMode): void {
    if (this.mode() === mode) {
      return;
    }

    this.mode.set(mode);
    this.form().reset();
    this.modeChanged.emit(mode);
  }

  protected submit(event: Event): void {
    event.preventDefault();
    this.form().markAsTouched();

    if (this.form().invalid() || this.isLoading()) {
      return;
    }

    const credentials = this.model();
    if (this.isSignIn()) {
      this.passwordSignInRequested.emit(credentials);
      return;
    }

    this.passwordSignUpRequested.emit(credentials);
  }
}
