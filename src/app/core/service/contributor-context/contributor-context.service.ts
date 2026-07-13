import { TechmatiRole } from '@/core/dto/profile.dto';
import { ContributorService } from '@/core/service/contributor/contributor.service';
import { Contributor } from '@/core/types/contributor.type';
import { computed, inject, Injectable, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

const LAST_CONTRIBUTOR_KEY = 'lastContributorId';

const COLLECTOR_ROLES: readonly TechmatiRole[] = ['collector', 'admin', 'root'];

function getStoredContributorId(): string | null {
  return typeof sessionStorage === 'undefined'
    ? null
    : sessionStorage.getItem(LAST_CONTRIBUTOR_KEY);
}

@Injectable({
  providedIn: 'root',
})
export class ContributorContextService {
  private readonly contributorService = inject(ContributorService);

  readonly contributors = signal<Contributor[]>([]);
  readonly activeContributor = signal<Contributor | null>(null);
  private readonly selectedContributorId = signal<string | null>(getStoredContributorId());
  readonly initialized = signal(false);
  readonly contributorsList = injectQuery(() => this.contributorService.list());

  readonly activeLoading = computed(() => this.contributorsList.isPending());

  readonly active = computed(() => {
    const list = this.contributorsList.data() ?? this.contributors();

    if (this.contributorsList.isPending() && list.length === 0) {
      return this.activeContributor();
    }

    if (list.length === 0) {
      return null;
    }

    const selectedId = this.selectedContributorId() ?? this.activeContributor()?.id;
    const cached = selectedId ? list.find((contributor) => contributor.id === selectedId) : null;

    return cached ?? this.activeContributor() ?? list[0];
  });
  readonly activeId = computed(() => this.active()?.id);

  readonly hasMultiple = computed(
    () => (this.contributorsList.data() ?? this.contributors()).length > 1,
  );

  canManageContributors(role: TechmatiRole | null | undefined): boolean {
    return role !== null && role !== undefined && COLLECTOR_ROLES.includes(role);
  }

  async ensureActiveAsync(): Promise<void> {
    if (this.initialized()) return;
    const list = await firstValueFrom(this.contributorService.listObservable());
    this.contributors.set(list);
    const lastId = getStoredContributorId();
    const cached = lastId ? list.find((c) => c.id === lastId) : null;
    const active = cached ?? list[0] ?? null;
    this.activeContributor.set(active);
    this.selectedContributorId.set(active?.id ?? null);
    this.initialized.set(true);
  }

  setActive(c: Contributor): void {
    this.activeContributor.set(c);
    this.selectedContributorId.set(c.id);
    sessionStorage.setItem(LAST_CONTRIBUTOR_KEY, c.id);
  }

  async getActiveContributorIdAsync(): Promise<string> {
    if (!this.initialized()) await this.ensureActiveAsync();
    const active = this.active();
    if (!active) {
      throw new Error('No active contributor available');
    }
    return active.id;
  }

  reset(): void {
    this.contributors.set([]);
    this.activeContributor.set(null);
    this.selectedContributorId.set(null);
    this.initialized.set(false);
    sessionStorage.removeItem(LAST_CONTRIBUTOR_KEY);
  }
}
