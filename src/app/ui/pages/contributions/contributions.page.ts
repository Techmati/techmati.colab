import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { GuestService } from '@/core/service/guest/guest.service';
import { ProfileService } from '@/core/service/profile/profile.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { GuestBanner } from '@/ui/molecules/guest-banner/guest-banner';
import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { ProfileAccessCard } from './ui/organisms/profile-access-card/profile-access-card';
import { ProfileContributionsPanel } from './ui/organisms/profile-contributions-panel/profile-contributions-panel';
import { ProfileSummaryPanel } from './ui/organisms/profile-summary-panel/profile-summary-panel';

@Component({
  selector: 'tm-contributions-page',
  imports: [
    TopAppBar,
    BottomNavBar,
    ProfileAccessCard,
    ProfileSummaryPanel,
    ProfileContributionsPanel,
    GuestBanner,
    ZardButtonComponent,
  ],
  templateUrl: './contributions.page.html',
  styleUrl: './contributions.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributionsPage {
  private readonly contributorContext = inject(ContributorContextService);
  private readonly guestService = inject(GuestService);
  private readonly profileService = inject(ProfileService);

  protected readonly isGuest = computed(() => this.guestService.isGuest());
  protected readonly recoveryCode = this.guestService.getRecoveryCode();
  protected readonly isCopied = signal(false);

  protected readonly profileQuery = injectQuery(() => this.profileService.findCurrent());
  protected readonly profile = computed(() => this.profileQuery.data() ?? null);

  protected readonly displayName = computed(() => {
    const alias = this.contributorContext.active()?.alias?.trim();
    if (this.isGuest()) {
      return alias || 'Invitado';
    }
    const fullName = this.profile()?.fullName?.trim();
    return fullName || alias || this.profile()?.username || 'Invitado';
  });

  protected readonly handle = computed(() => {
    if (this.isGuest()) {
      return 'Invitado';
    }
    const username = this.profile()?.username;
    return username ? `@${username}` : 'Invitado';
  });

  protected readonly initials = computed(() => this.extractInitials(this.displayName()));

  protected async copyRecoveryCode(): Promise<void> {
    if (!this.recoveryCode) return;
    await navigator.clipboard.writeText(this.recoveryCode);
    this.isCopied.set(true);
  }

  private extractInitials(value: string): string {
    const parts = value.split(' ').filter((part) => part.length > 0);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
    return `${first}${last}`.toUpperCase() || '??';
  }
}
