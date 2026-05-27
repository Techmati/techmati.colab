import { ContributorService } from '@/core/service/contributor/contributor.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { rxResource } from '@angular/core/rxjs-interop';
import { SkeletonComponent } from 'boneyard-js/angular';
@Component({
  selector: 'tm-greeting-panel',
  imports: [SkeletonComponent],
  templateUrl: './greeting-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingPanel {
  private readonly contributorService = inject(ContributorService);

  readonly contributor = rxResource({
    params: computed(() => ({ id: this.contributorService.sessionId() })),
    stream: ({ params: { id } }) => this.contributorService.getProfile(id || ''),
  });

  readonly singleName = computed(
    () => this.contributor.value()?.fullName.split(' ')[0] ?? 'Contribuidor',
  );
}
