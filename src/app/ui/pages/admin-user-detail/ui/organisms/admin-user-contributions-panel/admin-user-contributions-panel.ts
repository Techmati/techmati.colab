import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { type AdminUserContribution } from '../../../admin-user-detail.page';
import { AdminUserContributionCard } from '../../molecules/admin-user-contribution-card/admin-user-contribution-card';

@Component({
  selector: 'tm-admin-user-contributions-panel',
  imports: [AdminUserContributionCard, ZardButtonComponent],
  templateUrl: './admin-user-contributions-panel.html',
  styleUrl: './admin-user-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserContributionsPanel {
  readonly contributions = input.required<readonly AdminUserContribution[]>();
}
