import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import {
  AdminUserRoleFilter,
  AdminUserStatusFilter,
} from '../../../core/dto/admin-users-query.dto';

interface FilterOption<TValue extends string> {
  readonly label: string;
  readonly value: TValue;
}

@Component({
  selector: 'tm-admin-users-filter-panel',
  imports: [ZardButtonComponent],
  templateUrl: './admin-users-filter-panel.html',
  styleUrl: './admin-users-filter-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersFilterPanel {
  readonly selectedRole = input.required<AdminUserRoleFilter>();
  readonly selectedStatus = input.required<AdminUserStatusFilter>();
  readonly roleChange = output<AdminUserRoleFilter>();
  readonly statusChange = output<AdminUserStatusFilter>();

  protected readonly roleOptions: readonly FilterOption<AdminUserRoleFilter>[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Administrador', value: 'admin' },
    { label: 'Moderador', value: 'moderator' },
    { label: 'Analista', value: 'analyst' },
    { label: 'Usuario', value: 'user' },
  ];

  protected readonly statusOptions: readonly FilterOption<AdminUserStatusFilter>[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Activo', value: 'active' },
    { label: 'Baneado', value: 'banned' },
  ];
}
