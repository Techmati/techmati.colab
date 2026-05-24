import { ContributorService } from '@/core/service/contributor/contributor.service';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';

import { rxResource } from '@angular/core/rxjs-interop';
@Component({
  selector: 'tm-greeting-panel',
  imports: [],
  templateUrl: './greeting-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingPanel {
  private readonly contributorService = inject(ContributorService);

  readonly contributor = rxResource({
    params: computed(() => ({ id: this.contributorService.sessionId() })),
    stream: ({ params: { id } }) => {
      if (!id) throw new Error('No session ID found. User might not be logged in.');
      return this.contributorService.getProfile(id);
    },
  });

  readonly singleName = computed(
    () => this.contributor.value()?.fullName.split(' ')[0] ?? 'Contribuidor',
  );

  constructor() {
    //debug effect TODO: remove it
    effect(() => {
      console.log('Contributor: ', this.contributor.value());
      const name = this.singleName();
      console.log(`Olá, ${name}!`);
    });
  }
}
