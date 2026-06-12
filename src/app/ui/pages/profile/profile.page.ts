import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { ProfileContributionsPanel } from './ui/organisms/profile-contributions-panel/profile-contributions-panel';
import { ProfileSummaryPanel } from './ui/organisms/profile-summary-panel/profile-summary-panel';

@Component({
  selector: 'tm-profile-page',
  imports: [TopAppBar, BottomNavBar, ProfileSummaryPanel, ProfileContributionsPanel],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {}
