import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { TimeAgoPipe } from '@/core/pipes/time-ago.pipe';
import { type PhraseSetsInProgress } from '@/core/types/contributor-summary-response.type';
import { ZardButtonComponent } from '@/shared/components/button';
import { Router } from '@angular/router';

@Component({
  selector: 'tm-in-progress-card',
  imports: [TimeAgoPipe, ZardButtonComponent],
  templateUrl: './in-progress-card.html',
  styleUrl: './in-progress-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InProgressCard {
  readonly task = input.required<PhraseSetsInProgress>();
  private readonly router = inject(Router);

  continue() {
    this.router.navigate(['/translate', this.task().phraseSet.id]);
  }
}
