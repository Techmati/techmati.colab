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
import { ZardPaginationComponent } from '@/shared/components/pagination';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { AdminBottomNav } from '@/ui/organisms/admin-bottom-nav/admin-bottom-nav';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { AdminUserRoleFilter, AdminUsersQuery } from './core/dto/admin-users-query.dto';
import { AdminUsersService } from './core/service/admin-users.service';
import { AdminUserCard } from './ui/molecules/admin-user-card/admin-user-card';
import { AdminUsersFilterPanel } from './ui/organisms/admin-users-filter-panel/admin-users-filter-panel';

@Component({
  selector: 'tm-admin-users-page',
  imports: [
    TopAppBar,
    AdminBottomNav,
    AdminUserCard,
    AdminUsersFilterPanel,
    ZardEmptyComponent,
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

  protected readonly page = signal(1);

  private readonly router = inject(Router);
  private readonly adminUsersService = inject(AdminUsersService);

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
      this.page.set(this.normalizePage(this.pageParam()));
    });
  }

  protected selectPage(page: number): void {
    this.page.set(page);
    void this.router.navigate([], {
      queryParams: { page: page > 1 ? page : null },
      queryParamsHandling: 'merge',
    });
  }

  private normalizeRoleFilter(value: string): AdminUserRoleFilter {
    const values: AdminUserRoleFilter[] = ['all', 'root', 'admin', 'moderator', 'analyst', 'collector', 'user'];
    return values.includes(value as AdminUserRoleFilter) ? (value as AdminUserRoleFilter) : 'all';
  }

  private normalizeStatusFilter(value: string): 'all' | 'active' | 'banned' {
    const values = ['all', 'active', 'banned'] as const;
    return values.includes(value as typeof values[number]) ? (value as typeof values[number]) : 'all';
  }

  private normalizePage(value: string): number {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
  }
}
