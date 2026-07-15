import { TechmatiRole } from '@/core/dto/profile.dto';
import { ContributorService } from '@/core/service/contributor/contributor.service';
import { Contributor } from '@/core/types/contributor.type';
import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ProfileService } from '../profile/profile.service';

const LAST_CONTRIBUTOR_KEY = 'lastContributorId';

const COLLECTOR_ROLES: readonly TechmatiRole[] = ['collector', 'admin', 'root'];

@Injectable({
  providedIn: 'root',
})
export class ContributorContextService {
  private readonly contributorService = inject(ContributorService);
  private readonly profileService = inject(ProfileService);

  readonly activeContributor = signal<Contributor | null>(null);
  readonly initialized = signal(false);
  readonly contributorsList = injectQuery(() => this.contributorService.list());
  readonly profile = injectQuery(() => this.profileService.findCurrent());

  readonly active = linkedSignal(() => {
    const list = this.contributorsList.data() ?? [];

    if (this.contributorsList.isPending() || list.length === 0) {
      return null;
    }

    const selectedId = this.getSavedContributorId();

    const selectedContributor = list.find((contributor) => contributor.id === selectedId);
    if (!selectedContributor || !selectedId)
      return list.find((c) => this.profile.data()?.id == c.accountUserId) ?? list[0];
    return selectedContributor;
  });

  readonly activeLoading = computed(() => this.contributorsList.isPending());

  readonly activeId = computed(() => this.active()?.id);

  readonly hasMultiple = computed(() => (this.contributorsList.data() ?? []).length > 1);

  constructor() {
    window.addEventListener('beforeunload', () => {
      this.saveSelectedContributorId();
    });
  }

  canManageContributors(role: TechmatiRole | null | undefined): boolean {
    return role !== null && role !== undefined && COLLECTOR_ROLES.includes(role);
  }

  setActive(c: Contributor): void {
    this.activeContributor.set(c);
  }

  async getActiveContributorIdAsync(): Promise<string> {
    const active = this.active();
    if (!active) {
      throw new Error('No active contributor available');
    }
    return active.id;
  }

  getSavedContributorId(): string | null {
    return sessionStorage.getItem(LAST_CONTRIBUTOR_KEY);
  }

  saveSelectedContributorId(): void {
    const selectedId = this.activeContributor()?.id;
    if (!selectedId) {
      sessionStorage.removeItem(LAST_CONTRIBUTOR_KEY);
      return;
    }
    sessionStorage.setItem(LAST_CONTRIBUTOR_KEY, selectedId);
  }
}
