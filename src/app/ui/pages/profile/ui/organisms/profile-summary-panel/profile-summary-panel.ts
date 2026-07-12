import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { defer, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProfileSummaryPanelSkeleton } from '../profile-summary-panel-skeleton/profile-summary-panel-skeleton';

@Component({
  selector: 'tm-profile-summary-panel',
  imports: [ProfileSummaryPanelSkeleton],
  templateUrl: './profile-summary-panel.html',
  styleUrl: './profile-summary-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSummaryPanel {
  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);

  readonly stats = rxResource({
    stream: () =>
      defer(() => from(this.contributorContext.getActiveContributorId())).pipe(
        switchMap((cId) => this.translationService.getStats(cId)),
      ),
  });
}
