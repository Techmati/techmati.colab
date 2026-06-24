import { TechmatiRole } from '@/core/dto/profile.dto';

export type AdminUserRoleFilter = 'all' | TechmatiRole;
export type AdminUserStatus = 'active' | 'banned';
export type AdminUserStatusFilter = 'all' | AdminUserStatus;

export interface AdminUsersQuery {
  search: string;
  role: AdminUserRoleFilter;
  status: AdminUserStatusFilter;
  page: number;
  size: number;
}
