import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { TimeAgoPipe } from '@/core/pipes/time-ago.pipe';
import { Translation } from '@/core/types/translation.type';
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
  readonly card = input.required<Translation>();

  private readonly router = inject(Router);

  protected goToDetails(): void {
    const translation = this.card();
    const title = translation.phraseSet?.title;
    this.router.navigate(['/translation', translation.id], {
      queryParams: title ? { title } : {},
    });
  }
}
