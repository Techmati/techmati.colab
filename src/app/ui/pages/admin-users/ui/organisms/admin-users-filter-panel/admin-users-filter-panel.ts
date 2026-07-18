import { ZardAccordionImports } from '@/shared/components/accordion';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AdminUserRoleFilter,
  AdminUserStatusFilter,
} from '../../../core/dto/admin-users-query.dto';

@Component({
  selector: 'tm-admin-users-filter-panel',
  imports: [
    FormsModule,
    ZardButtonComponent,
    ZardInputDirective,
    ZardInputGroupComponent,
    ...ZardAccordionImports,
  ],
  templateUrl: './admin-users-filter-panel.html',
  styleUrl: './admin-users-filter-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersFilterPanel {
  readonly searchParam = input('');
  readonly roleParam = input('all');
  readonly statusParam = input('all');

  protected readonly search = signal('');
  protected readonly debouncedSearch = signal('');
  protected readonly selectedRole = signal<AdminUserRoleFilter>('all');
  protected readonly selectedStatus = signal<AdminUserStatusFilter>('all');

  private readonly router = inject(Router);
  private readonly DEBOUNCE_DELAY = 750;

  protected readonly roleOptions: { label: string; value: AdminUserRoleFilter }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Administrador', value: 'admin' },
    { label: 'Moderador', value: 'moderator' },
    { label: 'Analista', value: 'analyst' },
    { label: 'Recolector', value: 'collector' },
    { label: 'Usuario', value: 'user' },
  ];

  protected readonly statusOptions: { label: string; value: AdminUserStatusFilter }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Activo', value: 'active' },
    { label: 'Baneado', value: 'banned' },
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
      const search = this.debouncedSearch();
      if (search === (this.searchParam() || '').trim()) {
        return;
      }
      void this.router.navigate([], {
        queryParams: { search: search || null },
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
    void this.router.navigate([], {
      queryParams: { role },
      queryParamsHandling: 'merge',
    });
  }

  protected selectStatus(status: AdminUserStatusFilter): void {
    this.selectedStatus.set(status);
    void this.router.navigate([], {
      queryParams: { status },
      queryParamsHandling: 'merge',
    });
  }

  protected clearFilters(): void {
    this.search.set('');
    this.debouncedSearch.set('');
    this.selectedRole.set('all');
    this.selectedStatus.set('all');

    void this.router.navigate([], {
      queryParams: {
        search: null,
        role: null,
        status: null,
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  private normalizeRoleFilter(value: string): AdminUserRoleFilter {
    const values: AdminUserRoleFilter[] = ['all', 'root', 'admin', 'moderator', 'analyst', 'collector', 'user'];
    return values.includes(value as AdminUserRoleFilter) ? (value as AdminUserRoleFilter) : 'all';
  }

  private normalizeStatusFilter(value: string): AdminUserStatusFilter {
    const values: AdminUserStatusFilter[] = ['all', 'active', 'banned'];
    return values.includes(value as AdminUserStatusFilter) ? (value as AdminUserStatusFilter) : 'all';
  }
}
