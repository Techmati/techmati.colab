import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TimeAgoPipe } from '@/core/pipes/time-ago.pipe';
import { RecentContributionDto } from '../../../core/dto/latest-contributions-response.dto';

@Component({
  selector: 'tm-recent-contribution-card',
  imports: [TimeAgoPipe],
  templateUrl: './recent-contribution-card.html',
  styleUrl: './recent-contribution-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentContributionCard {
  readonly contribution = input.required<RecentContributionDto>();

  readonly initials = computed(() => {
    const name = this.contribution().contributorName || '';
    const parts = name.split(' ').filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return `${first}${last}`.toUpperCase();
  });
}
