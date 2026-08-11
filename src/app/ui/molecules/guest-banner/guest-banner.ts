import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-guest-banner',
  imports: [ZardButtonComponent],
  templateUrl: './guest-banner.html',
  styleUrl: './guest-banner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestBanner {
  private readonly router = inject(Router);

  protected goToSignup(): void {
    void this.router.navigate(['/signup']);
  }
}
