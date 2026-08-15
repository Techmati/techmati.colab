import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ContributionCard } from '@/ui/molecules/contribution-card/contribution-card';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ProfileContributionsPanelSkeleton } from '../profile-contributions-panel-skeleton/profile-contributions-panel-skeleton';

@Component({
  selector: 'tm-profile-contributions-panel',
  imports: [RouterLink, ContributionCard, ZardEmptyComponent, ProfileContributionsPanelSkeleton],
  templateUrl: './profile-contributions-panel.html',
  styleUrl: './profile-contributions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContributionsPanel {
  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);

  readonly completedSetsRes = injectQuery(() => {
    const contributor = this.contributorContext.active()!;
    return {
      ...this.translationService.listByContributor(contributor.id, {
        filter: 'completed',
        page: 1,
        size: 10,
        include_phrase_set: true,
      }),
      enabled: !!contributor,
    };
  });
}
