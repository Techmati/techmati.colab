import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PhraseSetsInProgress } from '@/core/types/contributor-summary-response.type';
import { ZardButtonComponent } from '@/shared/components/button';

//TODO: remove this interface and use translation entry instead
export interface ContributionCardViewModel {
  readonly title: string;
  readonly date: string;
  readonly status: string;
  readonly timeAgo: string;
  readonly totalPhrases: string;
}

@Component({
  selector: 'tm-contribution-card',
  imports: [ZardButtonComponent],
  templateUrl: './contribution-card.html',
  styleUrl: './contribution-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributionCard {
  readonly card = input.required<PhraseSetsInProgress>();
}
