import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';

import { type Profile } from '@/core/dto/profile.dto';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { ZardPaginationComponent } from '@/shared/components/pagination';
import { AdminBottomNav } from '@/ui/organisms/admin-bottom-nav/admin-bottom-nav';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminUserCard } from './ui/molecules/admin-user-card/admin-user-card';
import {
  AdminUserRoleFilter,
  AdminUsersFilterPanel,
  AdminUserStatusFilter,
} from './ui/organisms/admin-users-filter-panel/admin-users-filter-panel';

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
    ZardInputDirective,
    ZardInputGroupComponent,
    ZardPaginationComponent,
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

  private readonly DEBOUNCE_DELAY = 750;

  protected readonly users: readonly Profile[] = [
    {
      id: 'usr-ana-lopez',
      fullName: 'Ana López',
      username: 'alopez_traductora',
      email: 'ana.lopez@tlacuilo.org',
      bannedUntil: null,
      role: 'admin',
      createdAt: '2026-06-02T10:00:00.000Z',
    },
    {
      id: 'usr-carlos-xochitiotzin',
      fullName: 'Carlos Xochitiotzin',
      username: 'cxochi_admin',
      email: 'carlos.x@tlacuilo.org',
      bannedUntil: null,
      role: 'moderator',
      createdAt: '2026-06-04T12:30:00.000Z',
    },
    {
      id: 'usr-maria-ruiz',
      fullName: 'María Ruiz',
      username: 'mruiz_revisora',
      email: 'maria.ruiz@tlacuilo.org',
      bannedUntil: null,
      role: 'analyst',
      createdAt: '2026-06-08T09:45:00.000Z',
    },
    {
      id: 'usr-juan-martinez',
      fullName: 'Juan Martínez',
      username: 'jmartinez_dev',
      email: 'juan.m@tlacuilo.org',
      bannedUntil: '2026-07-01T00:00:00.000Z',
      role: 'user',
      createdAt: '2026-06-12T16:15:00.000Z',
    },
  ];

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
