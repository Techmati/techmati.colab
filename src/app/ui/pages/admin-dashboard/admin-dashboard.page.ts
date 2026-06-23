import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';
import { AdminQuickAction } from './core/types/admin-dashboard.types';
import { AdminBottomNav } from './ui/organisms/admin-bottom-nav/admin-bottom-nav';
import { AdminMetricsPanel } from './ui/organisms/admin-metrics-panel/admin-metrics-panel';
import { AdminQuickActionsPanel } from './ui/organisms/admin-quick-actions-panel/admin-quick-actions-panel';
import { NewUsersPanel } from './ui/organisms/new-users-panel/new-users-panel';
import { RecentContributionsPanel } from './ui/organisms/recent-contributions-panel/recent-contributions-panel';

@Component({
  selector: 'tm-admin-dashboard-page',
  imports: [
    TopAppBar,
    AdminMetricsPanel,
    AdminQuickActionsPanel,
    RecentContributionsPanel,
    NewUsersPanel,
    AdminBottomNav,
  ],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPage {
  protected readonly quickActions: readonly AdminQuickAction[] = [
    {
      label: 'Gestionar Frases',
      icon: 'ri--file-list-3-line',
      tone: 'purple',
      variant: 'solid',
    },
    {
      label: 'Gestionar Usuarios',
      icon: 'ri--group-line',
      tone: 'purple',
      variant: 'outline',
    },
    {
      label: 'Revisar Traducciones',
      icon: 'ri--checkbox-circle-line',
      tone: 'green',
      variant: 'solid',
    },
  ];
}
