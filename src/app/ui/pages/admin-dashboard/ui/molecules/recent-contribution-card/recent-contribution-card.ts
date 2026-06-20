import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { RecentContribution } from '../../../admin-dashboard.types';

@Component({
  selector: 'tm-recent-contribution-card',
  imports: [],
  templateUrl: './recent-contribution-card.html',
  styleUrl: './recent-contribution-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentContributionCard {
  readonly contribution = input.required<RecentContribution>();
}
