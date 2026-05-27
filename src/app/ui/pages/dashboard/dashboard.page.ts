import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';

import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { AvailableContributionsPanel } from './ui/available-contributions-panel/available-contributions-panel';
import { GreetingPanel } from './ui/greeting-panel/greeting-panel';
import { InProgressPanel } from './ui/in-progress-panel/in-progress-panel';

@Component({
  selector: 'tm-dashboard-page',
  imports: [TopAppBar, BottomNavBar, GreetingPanel, InProgressPanel, AvailableContributionsPanel],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  readonly isGreetingPanelLoading = signal(true);
  readonly isInProgressPanelLoading = signal(true);
  readonly isAvailableContributionsPanelLoading = signal(true);

  readonly isLoading = computed(
    () =>
      this.isGreetingPanelLoading() ||
      this.isInProgressPanelLoading() ||
      this.isAvailableContributionsPanelLoading(),
  );

  constructor() {
    effect(() => console.log('Dashboard loading state:', this.isLoading()));
  }
}
