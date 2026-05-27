import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ContributionCard,
  type ContributionCardViewModel,
} from '@/ui/molecules/contribution-card/contribution-card';

@Component({
  selector: 'tm-profile-contributions-panel',
  imports: [RouterLink, ContributionCard],
  templateUrl: './profile-contributions-panel.html',
  styleUrl: './profile-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContributionsPanel {
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
