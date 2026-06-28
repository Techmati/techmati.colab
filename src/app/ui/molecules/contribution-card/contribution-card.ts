import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { TimeAgoPipe } from '@/core/pipes/time-ago.pipe';
import { PhraseSetSummary } from '@/core/types/summary.type';
import { ZardButtonComponent } from '@/shared/components/button';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'tm-contribution-card',
  imports: [ZardButtonComponent, TimeAgoPipe, DatePipe],
  templateUrl: './contribution-card.html',
  styleUrl: './contribution-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributionCard {
  readonly card = input.required<PhraseSetSummary>();

  private readonly router = inject(Router);

  protected goToDetails(): void {
    this.router.navigate(['/set-entries', this.card().phraseSet.id], {
      queryParams: { title: this.card().phraseSet.title },
    });
  }
}
