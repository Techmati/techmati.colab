import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

interface ContributionCard {
  readonly id: number;
  readonly title: string;
  readonly date: string;
  readonly totalPhrases: string;
}

@Component({
  selector: 'tm-available-contributions-panel',
  imports: [ZardButtonComponent],
  templateUrl: './available-contributions-panel.html',
  styleUrl: './available-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableContributionsPanel {
  protected readonly cards: ContributionCard[] = [
    { id: 1, title: 'Dolores de cabeza', date: 'Oct 24, 2023', totalPhrases: '30 frases' },
    { id: 2, title: 'Dolores de cabeza', date: 'Oct 24, 2023', totalPhrases: '30 frases' },
    { id: 3, title: 'Dolores de cabeza', date: 'Oct 24, 2023', totalPhrases: '30 frases' },
  ];
}
