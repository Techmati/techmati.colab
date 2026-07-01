import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type UserPhraseSetContributionSummary } from '@/core/types/summary.type';
import { ZardButtonComponent } from '@/shared/components/button';
import { RouterLink } from '@angular/router';
import { AdminUserContributionPhraseCard } from '../../molecules/admin-user-contribution-phrase-card/admin-user-contribution-phrase-card';

@Component({
  selector: 'tm-admin-user-contribution-phrase-set-panel',
  imports: [AdminUserContributionPhraseCard, ZardButtonComponent, RouterLink],
  templateUrl: './admin-user-contribution-phrase-set-panel.html',
  styleUrl: './admin-user-contribution-phrase-set-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserContributionPhraseSetPanel {
  readonly contribution = input.required<UserPhraseSetContributionSummary>();
}
