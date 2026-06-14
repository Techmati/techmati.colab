import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

import { AuthCredentials, SignUpCredentials } from '../../../welcome-auth.type';
import { LoginForm } from '../login-form/login-form';
import { SignupForm } from '../signup-form/signup-form';

type AuthMode = 'sign-in' | 'sign-up';

@Component({
  selector: 'tm-welcome-panel',
  imports: [NgOptimizedImage, ZardButtonComponent, LoginForm, SignupForm],
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
  readonly passwordSignUpRequested = output<SignUpCredentials>();
  readonly modeChanged = output<AuthMode>();

  protected readonly mode = signal<AuthMode>('sign-in');
  protected readonly formError = signal<string | null>(null);
  protected readonly isSignIn = computed(() => this.mode() === 'sign-in');
  protected readonly displayedError = computed(() => this.formError() ?? this.error());

  protected readonly logoUrl = '/res/brand.jpg';

  protected selectMode(mode: AuthMode): void {
    if (this.mode() === mode) {
      return;
    }

    this.mode.set(mode);
    this.formError.set(null);
    this.modeChanged.emit(mode);
  }

  protected requestPasswordSignIn(credentials: AuthCredentials): void {
    this.formError.set(null);
    this.passwordSignInRequested.emit(credentials);
  }

  protected requestPasswordSignUp(credentials: SignUpCredentials): void {
    this.formError.set(null);
    this.passwordSignUpRequested.emit(credentials);
  }

  protected setFormError(message: string | null): void {
    this.formError.set(message);
  }
}
