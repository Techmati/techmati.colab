import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { GuestService } from '@/core/service/guest/guest.service';
import { GuestBanner } from '@/ui/molecules/guest-banner/guest-banner';
import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { HistoryListPanel } from './ui/organisms/history-list-panel/history-list-panel';

@Component({
  selector: 'tm-profile-history-page',
  imports: [TopAppBar, BottomNavBar, HistoryListPanel, GuestBanner],
  templateUrl: './profile-history.page.html',
  styleUrl: './profile-history.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHistoryPage {
  private readonly guestService = inject(GuestService);

  protected readonly isGuest = computed(() => this.guestService.isGuest());
}
