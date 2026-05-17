import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ProfileContributionCard,
  type ProfileContributionCardViewModel,
} from '../profile-contribution-card/profile-contribution-card';

@Component({
  selector: 'tm-profile-contributions-panel',
  imports: [RouterLink, ProfileContributionCard],
  templateUrl: './profile-contributions-panel.html',
  styleUrl: './profile-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContributionsPanel {
  protected readonly cards: ProfileContributionCardViewModel[] = [
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
