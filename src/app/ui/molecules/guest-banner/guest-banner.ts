import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { GuestService } from '@/core/service/guest/guest.service';
import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-guest-banner',
  imports: [ZardButtonComponent, RouterLink],
  templateUrl: './guest-banner.html',
  styleUrl: './guest-banner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestBanner {
  private readonly guestService = inject(GuestService);
  private readonly router = inject(Router);

  protected readonly recoveryCode = this.guestService.getRecoveryCode();
  protected readonly isCopied = signal(false);

  protected async copyRecoveryCode(): Promise<void> {
    if (!this.recoveryCode) return;
    await navigator.clipboard.writeText(this.recoveryCode);
    this.isCopied.set(true);
  }

  protected goToSignup(): void {
    void this.router.navigate(['/signup']);
  }
}
