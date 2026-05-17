import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

export interface ProfileContributionCardViewModel {
  readonly title: string;
  readonly date: string;
  readonly status: string;
  readonly timeAgo: string;
  readonly totalPhrases: string;
}

@Component({
  selector: 'tm-profile-contribution-card',
  imports: [ZardButtonComponent],
  templateUrl: './profile-contribution-card.html',
  styleUrl: './profile-contribution-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContributionCard {
  readonly card = input.required<ProfileContributionCardViewModel>();
}
