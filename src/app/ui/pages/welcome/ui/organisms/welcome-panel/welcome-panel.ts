import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { type SegmentedOption, ZardSegmentedComponent } from '@/shared/components/segmented';

import { FirstTimeSetupData } from '../../../core/types/first-time-setup-data.type';
import { AuthCredentials } from '../../../welcome-auth.type';
import { FirstTimeForm } from '../first-time-form/first-time-form';
import { LoginForm } from '../login-form/login-form';
import { RecoveryForm } from '../recovery-form/recovery-form';

type AuthMode = 'sign-in' | 'quick-flow' | 'recovery';

@Component({
  selector: 'tm-welcome-panel',
  imports: [
    NgOptimizedImage,
    ZardSegmentedComponent,
    LoginForm,
    FirstTimeForm,
    RecoveryForm,
  ],
  templateUrl: './welcome-panel.html',
  styleUrl: './welcome-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePanel {
  readonly isLoading = input.required<boolean>();
  readonly error = input<string | null>();
  readonly success = input<string | null>();

  readonly passwordSignInRequested = output<AuthCredentials>();
  readonly firstTimeSetupRequested = output<FirstTimeSetupData>();
  readonly recoveryRequested = output<{ recoveryCode: string }>();
  readonly modeChanged = output<AuthMode>();

  protected readonly mode = signal<AuthMode>('quick-flow');
  protected readonly formError = signal<string | null>(null);
  protected readonly isSignIn = computed(() => this.mode() === 'sign-in');
  protected readonly displayedError = computed(() => this.formError() ?? this.error());
  protected readonly authOptions: SegmentedOption[] = [
    { value: 'quick-flow', label: 'Registro rápido' },
    { value: 'sign-in', label: 'Iniciar sesión' },
    { value: 'recovery', label: 'Código de recuperación' },
  ];

  protected readonly logoUrl = '/res/brand.jpeg';

  protected selectMode(mode: string): void {
    if (mode !== 'sign-in' && mode !== 'quick-flow' && mode !== 'recovery') {
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

  protected requestFirstTimeSetup(contributorData: FirstTimeSetupData): void {
    this.formError.set(null);
    this.firstTimeSetupRequested.emit(contributorData);
  }

  protected requestRecovery(credentials: { recoveryCode: string }): void {
    this.formError.set(null);
    this.recoveryRequested.emit(credentials);
  }

  protected setFormError(message: string | null): void {
    this.formError.set(message);
  }
}
