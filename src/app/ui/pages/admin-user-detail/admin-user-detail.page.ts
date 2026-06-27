import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { type Profile, type TechmatiRole } from '@/core/dto/profile.dto';
import { AdminUserAttributesPanel } from './ui/organisms/admin-user-attributes-panel/admin-user-attributes-panel';
import { AdminUserContributionsPanel } from './ui/organisms/admin-user-contributions-panel/admin-user-contributions-panel';
import { AdminUserProfileHeader } from './ui/organisms/admin-user-profile-header/admin-user-profile-header';
import { AdminUserRiskPanel } from './ui/organisms/admin-user-risk-panel/admin-user-risk-panel';
import { AdminUserDetailTopBar } from './ui/organisms/admin-user-detail-top-bar/admin-user-detail-top-bar';

export interface AdminUserContribution {
  readonly id: string;
  readonly title: string;
  readonly relativeTime: string;
  readonly amount: string;
}

@Component({
  selector: 'tm-admin-user-detail-page',
  imports: [
    AdminUserDetailTopBar,
    AdminUserProfileHeader,
    AdminUserAttributesPanel,
    AdminUserContributionsPanel,
    AdminUserRiskPanel,
  ],
  templateUrl: './admin-user-detail.page.html',
  styleUrl: './admin-user-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserDetailPage {
  readonly userId = input.required<string>();

  protected readonly user: Profile = {
    id: 'usr-carlos-mendoza',
    fullName: 'Carlos Mendoza',
    username: 'cmendoza_tl',
    email: 'carlos.mendoza@tlacuilo.org',
    bannedUntil: null,
    role: 'user',
    createdAt: '2023-10-12T10:00:00.000Z',
  };

  protected readonly selectedRole = signal<TechmatiRole>(this.user.role);

  protected readonly contributions: readonly AdminUserContribution[] = [
    {
      id: 'contribution-medical-vocabulary',
      title: 'Vocabulario Médico',
      relativeTime: 'Hace 2 días',
      amount: '12 términos',
    },
    {
      id: 'contribution-emergency-phrases',
      title: 'Frases de Emergencia',
      relativeTime: 'Hace 5 días',
      amount: '8 frases',
    },
    {
      id: 'contribution-common-symptoms',
      title: 'Síntomas Comunes',
      relativeTime: 'Hace 1 semana',
      amount: '24 términos',
    },
  ];
}
