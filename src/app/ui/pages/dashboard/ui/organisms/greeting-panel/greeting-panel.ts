import { ContributorService } from '@/core/service/contributor/contributor.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
} from '@angular/core';

import { rxResource } from '@angular/core/rxjs-interop';
@Component({
  selector: 'tm-greeting-panel',
  imports: [],
  templateUrl: './greeting-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingPanel {
  private readonly contributorService = inject(ContributorService);

  readonly loading = output<boolean>();

  readonly contributor = rxResource({
    params: computed(() => ({ id: this.contributorService.sessionId() })),
    stream: ({ params: { id } }) => this.contributorService.getProfile(id || ''),
  });

  readonly singleName = computed(
    () => this.contributor.value()?.fullName.split(' ')[0] ?? 'Contribuidor',
  );

  constructor() {
    effect(() => {
      this.loading.emit(this.contributor.isLoading());
    });
  }
}
