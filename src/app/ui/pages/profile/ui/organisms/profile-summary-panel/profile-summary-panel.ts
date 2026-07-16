import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
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

  readonly stats = injectQuery(() => {
    const contributor = this.contributorContext.active()!;
    return {
      ...this.translationService.getStats(contributor.id),
      enabled: !!contributor,
    };
  });
}
