import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RecentContributionCard } from '../../molecules/recent-contribution-card/recent-contribution-card';
import type { RecentContribution } from '../../../admin-dashboard.types';

@Component({
  selector: 'tm-recent-contributions-panel',
  imports: [RecentContributionCard],
  templateUrl: './recent-contributions-panel.html',
  styleUrl: './recent-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentContributionsPanel {
  readonly contributions = input.required<readonly RecentContribution[]>();
}
