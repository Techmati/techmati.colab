import { TimeAgoPipe } from '@/core/pipes/time-ago.pipe';
import { ContributorService } from '@/core/service/contributor/contributor.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'tm-in-progress-panel',
  imports: [ZardButtonComponent, TimeAgoPipe],
  templateUrl: './in-progress-panel.html',
  styleUrl: './in-progress-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InProgressPanel {
  protected readonly cards = [1, 2];

  private readonly contributorService = inject(ContributorService);
  private readonly phraseSetsService = inject(PhraseSetsService);

  readonly inProgressRes = rxResource({
    params: computed(() => ({ id: this.contributorService.sessionId() })),
    stream: ({ params: { id } }) =>
      this.contributorService.getProfile(id).pipe(
        map((profile) => profile.id),
        switchMap((id) => this.phraseSetsService.getContributorSummary(id)),
      ),
  });

  readonly inProgress = computed(() => this.inProgressRes.value()?.phraseSetsInProgress || []);

  // readonly inProgress = rxResource({
  //   params: computed(() => ({ id: this.userId.value() })),
  //   stream: ({ params: { id } }) => this.phraseSetsService.getContributorSummary(id ?? '''),
  // });

  constructor() {
    effect(() => {
      console.log('In Progress Summary: ', this.inProgress());
    });
  }
}
