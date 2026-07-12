import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AvailableContributionsPanelSkeleton } from '../available-contributions-panel-skeleton/available-contributions-panel-skeleton';

@Component({
  selector: 'tm-available-contributions-panel',
  imports: [
    ZardButtonComponent,
    DatePipe,
    RouterLink,
    ZardEmptyComponent,
    AvailableContributionsPanelSkeleton,
  ],
  providers: [DatePipe],
  templateUrl: './available-contributions-panel.html',
  styleUrl: './available-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableContributionsPanel {
  private readonly phraseSetService = inject(PhraseSetsService);

  readonly phraseSetsRes = rxResource({
    stream: () => this.phraseSetService.getFiltered({ page: 1, size: 3, filter: 'untouched' }),
  });

  readonly phraseSets = computed(() => this.phraseSetsRes.value()?.data ?? []);

  date(string: string) {
    return new Date(string);
  }
}
