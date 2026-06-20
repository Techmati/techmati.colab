import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AdminBottomNav } from './ui/organisms/admin-bottom-nav/admin-bottom-nav';
import { AdminDashboardTopBar } from './ui/organisms/admin-dashboard-top-bar/admin-dashboard-top-bar';
import { AdminMetricsPanel } from './ui/organisms/admin-metrics-panel/admin-metrics-panel';
import { AdminQuickActionsPanel } from './ui/organisms/admin-quick-actions-panel/admin-quick-actions-panel';
import { NewUsersPanel } from './ui/organisms/new-users-panel/new-users-panel';
import { RecentContributionsPanel } from './ui/organisms/recent-contributions-panel/recent-contributions-panel';
import type {
  AdminMetric,
  AdminQuickAction,
  AdminUserPreview,
  RecentContribution,
} from './admin-dashboard.types';

@Component({
  selector: 'tm-admin-dashboard-page',
  imports: [
    AdminDashboardTopBar,
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
  protected readonly metrics: readonly AdminMetric[] = [
    {
      label: 'Contribuciones hoy',
      value: '1,284',
      icon: 'ri--file-list-3-line',
      tone: 'purple',
    },
    {
      label: 'Nuevos usuarios',
      value: '42',
      icon: 'ri--user-add-line',
      tone: 'green',
    },
  ];

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

  protected readonly recentContributions: readonly RecentContribution[] = [
    {
      contributorName: 'Juan Carlos M.',
      initials: 'JC',
      phraseSet: 'Frases medicas',
      completedPhrases: 5,
      totalPhrases: 24,
      submittedAt: 'Hoy, 14:20',
    },
    {
      contributorName: 'Elena Rodríguez',
      initials: 'ER',
      phraseSet: 'Sintomas comunes',
      completedPhrases: 12,
      totalPhrases: 12,
      submittedAt: 'Hoy, 13:45',
    },
    {
      contributorName: 'Miguel Sosa',
      initials: 'MS',
      phraseSet: 'Emergencias cardiacas',
      completedPhrases: 12,
      totalPhrases: 40,
      submittedAt: 'Hoy, 11:10',
    },
  ];

  protected readonly newUsers: readonly AdminUserPreview[] = [
    {
      fullName: 'Ana López',
      initials: 'AL',
      username: '@alopez_traductora',
      email: 'ana.lopez@tlacuilo.org',
    },
    {
      fullName: 'Roberto V.',
      initials: 'RV',
      username: '@roberto_v_revisor',
      email: 'roberto.v@tlacuilo.org',
    },
    {
      fullName: 'Lucía Méndez',
      initials: 'LM',
      username: '@lmendez_experta',
      email: 'lucia.m@tlacuilo.org',
    },
  ];
}
