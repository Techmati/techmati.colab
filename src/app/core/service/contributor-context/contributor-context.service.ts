import { GuestService } from '@/core/service/guest/guest.service';
import { ContributorService } from '@/core/service/contributor/contributor.service';
import { Contributor } from '@/core/types/contributor.type';
import { computed, inject, Injectable, linkedSignal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ProfileService } from '../profile/profile.service';

const LAST_CONTRIBUTOR_KEY = 'lastContributorId';

@Injectable({
  providedIn: 'root',
})
export class ContributorContextService {
  private readonly guestService = inject(GuestService);
  private readonly contributorService = inject(ContributorService);
  private readonly profileService = inject(ProfileService);

  private readonly contributorsList = injectQuery(() => this.contributorService.list());
  private readonly profile = injectQuery(() => this.profileService.findCurrent());

  readonly isGuest = computed(() => this.guestService.isGuest());

  readonly active = linkedSignal(() => {
    if (this.guestService.isGuest()) {
      return this.guestService.contributor();
    }

    const list = this.contributorsList.data() ?? [];

    if (this.contributorsList.isPending() || list.length === 0) {
      return null;
    }

    const selectedId = this.getSavedContributorId();

    const selectedContributor = list.find((contributor) => contributor.id === selectedId);
    if (!selectedContributor || !selectedId) {
      return list.find((c) => this.profile.data()?.id == c.accountUserId) ?? list[0];
    }
    return selectedContributor;
  });

  readonly activeLoading = computed(() =>
    this.guestService.isGuest() ? false : this.contributorsList.isPending(),
  );

  constructor() {
    window.addEventListener('beforeunload', () => {
      this.saveSelectedContributorId();
    });
  }

  setActive(c: Contributor): void {
    this.active.set(c);
  }

  private getSavedContributorId(): string | null {
    return sessionStorage.getItem(LAST_CONTRIBUTOR_KEY);
  }

  private saveSelectedContributorId(): void {
    const selectedId = this.active()?.id;
    if (!selectedId) {
      sessionStorage.removeItem(LAST_CONTRIBUTOR_KEY);
      return;
    }
    sessionStorage.setItem(LAST_CONTRIBUTOR_KEY, selectedId);
  }
}
