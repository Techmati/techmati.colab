import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { ZardPaginationComponent } from '@/shared/components/pagination';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { AdminBottomNav } from '@/ui/organisms/admin-bottom-nav/admin-bottom-nav';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import {
  AdminUserRoleFilter,
  AdminUserStatusFilter,
  AdminUsersQuery,
} from './core/dto/admin-users-query.dto';
import { AdminUsersService } from './core/service/admin-users.service';
import { AdminUserCard } from './ui/molecules/admin-user-card/admin-user-card';
import { AdminUsersFilterPanel } from './ui/organisms/admin-users-filter-panel/admin-users-filter-panel';

const ROLE_FILTER_VALUES = [
  'all',
  'root',
  'admin',
  'moderator',
  'analyst',
  'user',
] as const satisfies readonly AdminUserRoleFilter[];

const STATUS_FILTER_VALUES = [
  'all',
  'active',
  'banned',
] as const satisfies readonly AdminUserStatusFilter[];

@Component({
  selector: 'tm-admin-users-page',
  imports: [
    TopAppBar,
    AdminBottomNav,
    AdminUserCard,
    AdminUsersFilterPanel,
    FormsModule,
    ZardEmptyComponent,
    ZardInputDirective,
    ZardInputGroupComponent,
    ZardPaginationComponent,
    ZardSkeletonComponent,
  ],
  templateUrl: './admin-users.page.html',
  styleUrl: './admin-users.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersPage {
  protected readonly searchParam = input('', { alias: 'search' });
  protected readonly roleParam = input('', { alias: 'role' });
  protected readonly statusParam = input('', { alias: 'status' });
  protected readonly pageParam = input('', { alias: 'page' });

  protected readonly search = signal('');
  protected readonly debouncedSearch = signal('');
  protected readonly selectedRole = signal<AdminUserRoleFilter>('all');
  protected readonly selectedStatus = signal<AdminUserStatusFilter>('all');
  protected readonly page = signal(1);

  private readonly router = inject(Router);
  private readonly adminUsersService = inject(AdminUsersService);

  private readonly DEBOUNCE_DELAY = 750;
  private readonly PAGE_SIZE = 10;

  protected readonly usersQuery = computed<AdminUsersQuery>(() => ({
    search: (this.searchParam() || '').trim(),
    role: this.normalizeRoleFilter(this.roleParam()),
    status: this.normalizeStatusFilter(this.statusParam()),
    page: this.normalizePage(this.pageParam()),
    size: this.PAGE_SIZE,
  }));

  protected readonly searchResults = injectQuery(() =>
    this.adminUsersService.search(this.usersQuery()),
  );

  protected readonly pages = computed(() =>
    Math.ceil((this.searchResults.data()?.total || 0) / this.PAGE_SIZE),
  );

  protected readonly hasResults = computed(() => (this.searchResults.data()?.total ?? 0) > 0);

  constructor() {
    effect(() => {
      this.search.set(this.searchParam() || '');
    });

    effect(() => {
      this.selectedRole.set(this.normalizeRoleFilter(this.roleParam()));
    });

    effect(() => {
      this.selectedStatus.set(this.normalizeStatusFilter(this.statusParam()));
    });

    effect(() => {
      this.page.set(this.normalizePage(this.pageParam()));
    });

    effect(() => {
      const search = this.debouncedSearch();
      this.router.navigate([], {
        queryParams: { search },
        queryParamsHandling: 'merge',
      });
    });

    effect((onCleanup) => {
      const search = this.search().trim();
      const timeoutId = setTimeout(() => {
        this.debouncedSearch.set(search);
      }, this.DEBOUNCE_DELAY);
      onCleanup(() => clearTimeout(timeoutId));
    });
  }

  protected selectRole(role: AdminUserRoleFilter): void {
    this.selectedRole.set(role);
    this.router.navigate([], {
      queryParams: { role },
      queryParamsHandling: 'merge',
    });
  }

  protected selectStatus(status: AdminUserStatusFilter): void {
    this.selectedStatus.set(status);
    this.router.navigate([], {
      queryParams: { status },
      queryParamsHandling: 'merge',
    });
  }

  protected selectPage(page: number): void {
    this.page.set(page);
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  private normalizeRoleFilter(value: string): AdminUserRoleFilter {
    return (ROLE_FILTER_VALUES as readonly string[]).includes(value)
      ? (value as AdminUserRoleFilter)
      : 'all';
  }

  private normalizeStatusFilter(value: string): AdminUserStatusFilter {
    return (STATUS_FILTER_VALUES as readonly string[]).includes(value)
      ? (value as AdminUserStatusFilter)
      : 'all';
  }

  private normalizePage(value: string): number {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
  }
}
