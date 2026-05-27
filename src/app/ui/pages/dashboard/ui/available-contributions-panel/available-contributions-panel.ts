import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { DatePipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from 'boneyard-js/angular';

@Component({
  selector: 'tm-available-contributions-panel',
  imports: [ZardButtonComponent, DatePipe, RouterLink, SkeletonComponent],
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

  date(string: string) {
    return new Date(string);
  }
  readonly loading = output<boolean>();
  readonly sharedLoading = input.required<boolean>();
  constructor() {
    effect(() => {
      this.loading.emit(this.phraseSetsRes.isLoading());
    });
  }
}
