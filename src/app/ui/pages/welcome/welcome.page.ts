import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import { WelcomePanel } from './ui/organisms/welcome-panel/welcome-panel';
import { AuthCredentials, SignUpCredentials } from './welcome-auth.type';

@Component({
  selector: 'tm-welcome-page',
  imports: [WelcomePanel],
  templateUrl: './welcome.page.html',
  styleUrl: './welcome.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePage {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.authenticationService.isAuthenticated()) {
        this.goToDashboard();
      }
    });
  }

  async signInWithGoogle(): Promise<void> {
    this.startRequest();

    try {
      await this.authenticationService.signInWithOAuth('google');
    } catch {
      this.error.set('No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo.');
      this.isLoading.set(false);
    }
  }

  async signInWithPassword(credentials: AuthCredentials): Promise<void> {
    this.startRequest();

    try {
      await this.authenticationService.signInWithPassword(credentials.email, credentials.password);
    } catch {
      this.error.set('El correo o la contraseña no son correctos.');
      this.isLoading.set(false);
    }
  }

  async signUpWithPassword(credentials: SignUpCredentials): Promise<void> {
    this.startRequest();

    try {
      const requiresEmailConfirmation = await this.authenticationService.signUpWithPassword(
        credentials.email,
        credentials.password,
        credentials.fullName,
        credentials.username,
      );

      if (requiresEmailConfirmation) {
        this.success.set('Revisa tu correo y confirma tu cuenta para terminar el registro.');
        this.isLoading.set(false);
      }
    } catch {
      this.error.set('No se pudo crear la cuenta. Verifica tus datos e inténtalo de nuevo.');
      this.isLoading.set(false);
    }
  }

  clearMessages(): void {
    this.error.set(null);
    this.success.set(null);
  }

  private startRequest(): void {
    this.clearMessages();
    this.isLoading.set(true);
  }

  private goToDashboard() {
    void this.router.navigate(['/dashboard']);
  }
}
