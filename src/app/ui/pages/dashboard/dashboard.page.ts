import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { AvailableContributionsPanel } from './ui/organisms/available-contributions-panel/available-contributions-panel';
import { GreetingPanel } from './ui/organisms/greeting-panel/greeting-panel';
import { InProgressPanel } from './ui/organisms/in-progress-panel/in-progress-panel';
import { PriorityPanel } from './ui/organisms/priority-panel/priority-panel';
import { RepeatVariantPanel } from './ui/organisms/repeat-variant-panel/repeat-variant-panel';

@Component({
  selector: 'tm-dashboard-page',
  imports: [
    TopAppBar,
    BottomNavBar,
    GreetingPanel,
    InProgressPanel,
    RepeatVariantPanel,
    PriorityPanel,
    AvailableContributionsPanel,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}