import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TimeAgoPipe } from '@/core/pipes/time-ago.pipe';
import { PhraseSetSummary } from '@/core/types/summary.type';

@Component({
  selector: 'tm-admin-user-contribution-card',
  imports: [TimeAgoPipe],
  templateUrl: './admin-user-contribution-card.html',
  styleUrl: './admin-user-contribution-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserContributionCard {
  readonly contribution = input.required<PhraseSetSummary>();
}
