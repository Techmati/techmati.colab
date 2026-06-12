import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
} from '@angular/core';

import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tm-available-contributions-panel',
  imports: [ZardButtonComponent, DatePipe, RouterLink, ZardEmptyComponent],
  providers: [DatePipe],
  templateUrl: './available-contributions-panel.html',
  styleUrl: './available-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableContributionsPanel {
  private readonly phraseSetService = inject(PhraseSetsService);

  readonly loading = output<boolean>();

  readonly phraseSetsRes = rxResource({
    stream: () => this.phraseSetService.getFiltered(1, 3, 'untouched'),
  });

  readonly phraseSets = computed(() => this.phraseSetsRes.value()?.phraseSets ?? []);

  date(string: string) {
    return new Date(string);
  }
  constructor() {
    effect(() => {
      this.loading.emit(this.phraseSetsRes.isLoading());
    });
  }
}
