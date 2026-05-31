import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { SkeletonComponent } from 'boneyard-js/angular';
import { ProfileContributionsPanel } from './ui/organisms/profile-contributions-panel/profile-contributions-panel';
import { ProfileSummaryPanel } from './ui/organisms/profile-summary-panel/profile-summary-panel';

@Component({
  selector: 'tm-profile-page',
  imports: [
    TopAppBar,
    BottomNavBar,
    ProfileSummaryPanel,
    ProfileContributionsPanel,
    SkeletonComponent,
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {
  protected readonly summaryLoading = signal(true);

  protected readonly contributionsLoading = signal(true);

  protected readonly isLoading = computed(
    () => this.summaryLoading() || this.contributionsLoading(),
  );

  constructor() {
    effect(() => console.log(this.isLoading()));
  }
}
