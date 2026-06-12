import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tm-top-app-bar',
  imports: [ZardButtonComponent],
  templateUrl: './top-app-bar.html',
  styleUrl: './top-app-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopAppBar {
  readonly title = input('Techmati');
  readonly subtitle = input('');

  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  protected readonly isSigningOut = signal(false);

  protected async logout(): Promise<void> {
    this.isSigningOut.set(true);

    try {
      await this.authenticationService.signOut();
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Failed to sign out', error);
    } finally {
      this.isSigningOut.set(false);
    }
  }
}
