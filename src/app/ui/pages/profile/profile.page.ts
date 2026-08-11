import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { GuestService } from '@/core/service/guest/guest.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { GuestBanner } from '@/ui/molecules/guest-banner/guest-banner';
import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { ProfileContributionsPanel } from './ui/organisms/profile-contributions-panel/profile-contributions-panel';
import { ProfileSummaryPanel } from './ui/organisms/profile-summary-panel/profile-summary-panel';

@Component({
  selector: 'tm-profile-page',
  imports: [
    TopAppBar,
    BottomNavBar,
    ProfileSummaryPanel,
    ProfileContributionsPanel,
    GuestBanner,
    ZardButtonComponent,
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {
  private readonly guestService = inject(GuestService);

  protected readonly isGuest = computed(() => this.guestService.isGuest());
  protected readonly recoveryCode = this.guestService.getRecoveryCode();
  protected readonly isCopied = signal(false);

  protected async copyRecoveryCode(): Promise<void> {
    if (!this.recoveryCode) return;
    await navigator.clipboard.writeText(this.recoveryCode);
    this.isCopied.set(true);
  }
}
