import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type AdminUserContribution } from '../../../admin-user-detail.page';

@Component({
  selector: 'tm-admin-user-contribution-card',
  imports: [],
  templateUrl: './admin-user-contribution-card.html',
  styleUrl: './admin-user-contribution-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserContributionCard {
  readonly contribution = input.required<AdminUserContribution>();
}
