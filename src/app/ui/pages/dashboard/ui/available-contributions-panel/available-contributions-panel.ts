import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';

import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';

interface ContributionCard {
  readonly id: number;
  readonly title: string;
  readonly date: string;
  readonly totalPhrases: string;
}

@Component({
  selector: 'tm-available-contributions-panel',
  imports: [ZardButtonComponent, DatePipe],
  providers: [DatePipe],
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

  private readonly phraseSetService = inject(PhraseSetsService);

  readonly phraseSetsRes = rxResource({
    stream: () => this.phraseSetService.getPhraseSets(1, 3),
  });

  readonly phraseSets = computed(() => this.phraseSetsRes.value() ?? []);

  constructor() {
    effect(() => console.log('Available contributions:', this.phraseSets()));
  }

  date(string: string) {
    return new Date(string);
  }
}
