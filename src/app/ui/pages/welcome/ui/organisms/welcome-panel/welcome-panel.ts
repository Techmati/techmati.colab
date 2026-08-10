import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { type SegmentedOption, ZardSegmentedComponent } from '@/shared/components/segmented';

import { FirstTimeSetupData } from '../../../core/types/first-time-setup-data.type';
import { AuthCredentials, SignUpCredentials } from '../../../welcome-auth.type';
import { FirstTimeForm } from '../first-time-form/first-time-form';
import { LoginForm } from '../login-form/login-form';
import { SignupForm } from '../signup-form/signup-form';

type AuthMode = 'sign-in' | 'sign-up' | 'quick-flow';

@Component({
  selector: 'tm-welcome-panel',
  imports: [
    NgOptimizedImage,
    ZardButtonComponent,
    ZardSegmentedComponent,
    LoginForm,
    SignupForm,
    FirstTimeForm,
  ],
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
  readonly firstTimeSetupRequested = output<FirstTimeSetupData>();
  readonly modeChanged = output<AuthMode>();

  protected readonly mode = signal<AuthMode>('quick-flow');
  protected readonly formError = signal<string | null>(null);
  protected readonly isSignIn = computed(() => this.mode() === 'sign-in');
  protected readonly displayedError = computed(() => this.formError() ?? this.error());
  protected readonly authOptions: SegmentedOption[] = [
    { value: 'quick-flow', label: 'Registro rapido' },
    { value: 'sign-in', label: 'Iniciar sesión' },
  ];

  protected readonly logoUrl = '/res/brand.jpeg';

  protected selectMode(mode: string): void {
    if (mode !== 'sign-in' && mode !== 'sign-up' && mode !== 'quick-flow') {
      return;
    }

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

  protected requestFirstTimeSetup(contributorData: FirstTimeSetupData): void {
    this.formError.set(null);
    this.firstTimeSetupRequested.emit(contributorData);
  }

  protected setFormError(message: string | null): void {
    this.formError.set(message);
  }
}
