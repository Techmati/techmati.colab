import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';

import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tm-available-contributions-panel',
  imports: [ZardButtonComponent, DatePipe],
  providers: [DatePipe],
  templateUrl: './available-contributions-panel.html',
  styleUrl: './available-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableContributionsPanel {
  private readonly phraseSetService = inject(PhraseSetsService);

  readonly phraseSetsRes = rxResource({
    stream: () => this.phraseSetService.getFiltered(1, 3, 'untouched'),
  });

  readonly phraseSets = computed(() => this.phraseSetsRes.value() ?? []);

  constructor() {
    effect(() => console.log('Available contributions:', this.phraseSets()));
    effect(() => console.log('Phrase sets resource state:', this.phraseSetsRes));
    Object.assign(window, { res: this.phraseSetsRes });
  }

  date(string: string) {
    return new Date(string);
  }
}
