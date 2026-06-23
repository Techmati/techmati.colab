import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

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
  protected readonly search = signal('');
  protected readonly debouncedSearch = signal('');
  protected readonly selectedRole = signal<AdminUserRoleFilter>('all');
  protected readonly selectedStatus = signal<AdminUserStatusFilter>('all');
  protected readonly page = signal(2);
  private readonly router = inject(Router);
  private hasInitializedSearchNavigation = false;

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

  protected readonly filteredUsers = computed(() => {
    const search = this.searchParam().trim().toLowerCase();
    const role = this.selectedRole();
    const status = this.selectedStatus();

    return this.users.filter((user) => {
      const matchesRole = role === 'all' || user.role === role;
      const matchesStatus =
        status === 'all' ||
        (status === 'active' && user.bannedUntil === null) ||
        (status === 'banned' && user.bannedUntil !== null);
      const matchesSearch =
        search.length === 0 ||
        user.fullName.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search) ||
        (user.email?.toLowerCase().includes(search) ?? false);

      return matchesRole && matchesStatus && matchesSearch;
    });
  });

  constructor() {
    effect(() => {
      this.search.set(this.searchParam() || '');
    });

    effect(() => {
      const search = this.debouncedSearch();
      if (!this.hasInitializedSearchNavigation) {
        this.hasInitializedSearchNavigation = true;
        return;
      }

      if (search === this.searchParam().trim()) {
        return;
      }

      this.router.navigate([], { queryParams: { search } });
    });

    effect((onCleanup) => {
      const search = this.search().trim();
      const timeoutId = setTimeout(() => {
        this.debouncedSearch.set(search);
      }, this.DEBOUNCE_DELAY);
      onCleanup(() => clearTimeout(timeoutId));
    });
  }
}
