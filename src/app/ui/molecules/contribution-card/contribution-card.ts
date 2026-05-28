import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TimeAgoPipe } from '@/core/pipes/time-ago.pipe';
import { PhraseSetsInProgress } from '@/core/types/contributor-summary-response.type';
import { ZardButtonComponent } from '@/shared/components/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'tm-contribution-card',
  imports: [ZardButtonComponent, TimeAgoPipe, DatePipe],
  templateUrl: './contribution-card.html',
  styleUrl: './contribution-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributionCard {
  readonly card = input.required<PhraseSetsInProgress>();
}
