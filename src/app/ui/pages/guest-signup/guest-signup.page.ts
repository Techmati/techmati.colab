import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { injectMutation } from '@tanstack/angular-query-experimental';

import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import { ContributorService } from '@/core/service/contributor/contributor.service';
import { GuestService } from '@/core/service/guest/guest.service';
import { SignupForm } from '@/ui/pages/welcome/ui/organisms/signup-form/signup-form';
import { SignUpCredentials } from '@/ui/pages/welcome/welcome-auth.type';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'tm-guest-signup-page',
  imports: [NgOptimizedImage, SignupForm],
  templateUrl: './guest-signup.page.html',
  styleUrl: './guest-signup.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestSignupPage {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly contributorService = inject(ContributorService);
  private readonly guestService = inject(GuestService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  readonly fullName = computed(() => this.guestService.contributor()?.fullName ?? null);

  protected readonly logoUrl = '/res/brand.jpeg';

  private readonly claimGuestMutation = injectMutation(() => this.contributorService.claimGuest());

  async signUp(credentials: SignUpCredentials): Promise<void> {
    this.clearMessages();
    this.isLoading.set(true);

    try {
      await this.authenticationService.signUpWithPassword(
        credentials.email,
        credentials.password,
        credentials.fullName,
        credentials.username,
      );
      this.success.set('Cuenta creada. Vinculando tu trabajo como invitado...');

      const sessionToken = this.guestService.getSessionToken();
      if (sessionToken) {
        await this.claimGuestMutation.mutateAsync({ sessionToken });
        this.guestService.clearGuestSession();
      }

      this.isLoading.set(false);
      void this.router.navigate(['/dashboard']);
    } catch {
      this.error.set('No se pudo crear la cuenta. Verifica tus datos e inténtalo de nuevo.');
      this.isLoading.set(false);
    }
  }

  private clearMessages(): void {
    this.error.set(null);
    this.success.set(null);
  }
}
