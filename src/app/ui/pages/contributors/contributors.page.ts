import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { ContributorService } from '@/core/service/contributor/contributor.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ActiveContributorCard } from './ui/molecules/active-contributor-card/active-contributor-card';
import { ContributorCard } from './ui/molecules/contributor-card/contributor-card';
import { ContributorsHeader } from './ui/organisms/contributors-header/contributors-header';

@Component({
  selector: 'tm-contributors-page',
  imports: [TopAppBar, BottomNavBar, ContributorsHeader, ActiveContributorCard, ContributorCard],
  templateUrl: './contributors.page.html',
  styleUrl: './contributors.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsPage {
  private readonly contributorService = inject(ContributorService);
  private readonly contributorContext = inject(ContributorContextService);

  readonly contributorsList = injectQuery(() => this.contributorService.list());
  readonly activeContributor = computed(() => this.contributorContext.active());

  protected readonly inactiveContributors = computed(() =>
    this.contributorsList
      .data()
      ?.filter((contributor) => contributor.id != this.activeContributor()?.id),
  );

  protected readonly total = computed(() => this.contributorsList.data()?.length || 0);

  protected onActivate(id: string): void {
    void id;
  }

  protected onEdit(id: string): void {
    void id;
  }

  protected onRemove(id: string): void {
    void id;
  }

  protected onNewContributor(): void { }
}
