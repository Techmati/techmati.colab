import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ContributionCard,
  ContributionCardViewModel,
} from '@/ui/molecules/contribution-card/contribution-card';

@Component({
  selector: 'tm-history-list-panel',
  imports: [ContributionCard],
  templateUrl: './history-list-panel.html',
  styleUrl: './history-list-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryListPanel {
  protected readonly cards: ContributionCardViewModel[] = [
    {
      title: 'Dolores de cabeza',
      date: 'Oct 24, 2025',
      status: 'Terminado',
      timeAgo: 'Hace 2 horas',
      totalPhrases: '30 frases',
    },
    {
      title: 'Dolores de cabeza',
      date: 'Oct 24, 2025',
      status: 'Terminado',
      timeAgo: 'Hace 2 horas',
      totalPhrases: '30 frases',
    },
    {
      title: 'Dolores de cabeza',
      date: 'Oct 24, 2025',
      status: 'Terminado',
      timeAgo: 'Hace 2 horas',
      totalPhrases: '30 frases',
    },
  ];
}
