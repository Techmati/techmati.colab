import { TechmatiRole } from '@/core/dto/profile.dto';
import { ContributorService } from '@/core/service/contributor/contributor.service';
import { Contributor } from '@/core/types/contributor.type';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const LAST_CONTRIBUTOR_KEY = 'lastContributorId';

const COLLECTOR_ROLES: readonly TechmatiRole[] = ['collector', 'admin', 'root'];

@Injectable({
  providedIn: 'root',
})
export class ContributorContextService {
  private readonly contributorService = inject(ContributorService);

  readonly contributors = signal<Contributor[]>([]);
  readonly activeContributor = signal<Contributor | null>(null);
  readonly initialized = signal(false);

  readonly hasMultiple = computed(() => this.contributors().length > 1);

  canManageContributors(role: TechmatiRole | null | undefined): boolean {
    return role !== null && role !== undefined && COLLECTOR_ROLES.includes(role);
  }

  async ensureActive(): Promise<void> {
    if (this.initialized()) return;
    const list = await firstValueFrom(this.contributorService.list());
    this.contributors.set(list);
    const lastId = sessionStorage.getItem(LAST_CONTRIBUTOR_KEY);
    const cached = lastId ? list.find((c) => c.id === lastId) : null;
    this.activeContributor.set(cached ?? list[0] ?? null);
    this.initialized.set(true);
  }

  setActive(c: Contributor): void {
    this.activeContributor.set(c);
    sessionStorage.setItem(LAST_CONTRIBUTOR_KEY, c.id);
  }

  async getActiveContributorId(): Promise<string> {
    if (!this.initialized()) await this.ensureActive();
    const active = this.activeContributor();
    if (!active) {
      throw new Error('No active contributor available');
    }
    return active.id;
  }

  reset(): void {
    this.contributors.set([]);
    this.activeContributor.set(null);
    this.initialized.set(false);
    sessionStorage.removeItem(LAST_CONTRIBUTOR_KEY);
  }
}
