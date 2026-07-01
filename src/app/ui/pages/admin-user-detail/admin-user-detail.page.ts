import { AdminSummaryService } from '@/core/service/admin-summary/admin-summary.service';
import { type SummaryFilter } from '@/core/types/summary.type';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardToastComponent } from '@/shared/components/toast';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { ExternalToast, toast } from 'ngx-sonner';

import { type TechmatiRole } from '@/core/dto/profile.dto';
import { AdminUserDetailService } from './core/service/admin-user-detail.service';
import { AdminUserAttributesPanel } from './ui/organisms/admin-user-attributes-panel/admin-user-attributes-panel';
import { AdminUserContributionsPanel } from './ui/organisms/admin-user-contributions-panel/admin-user-contributions-panel';
import { AdminUserDetailTopBar } from './ui/organisms/admin-user-detail-top-bar/admin-user-detail-top-bar';
import { AdminUserProfileHeader } from './ui/organisms/admin-user-profile-header/admin-user-profile-header';
import { AdminUserRiskPanel } from './ui/organisms/admin-user-risk-panel/admin-user-risk-panel';

@Component({
  selector: 'tm-admin-user-detail-page',
  imports: [
    ZardSkeletonComponent,
    ZardToastComponent,
    AdminUserDetailTopBar,
    AdminUserProfileHeader,
    AdminUserAttributesPanel,
    AdminUserContributionsPanel,
    AdminUserRiskPanel,
  ],
  templateUrl: './admin-user-detail.page.html',
  styleUrl: './admin-user-detail.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserDetailPage {
  readonly userId = input.required<string>();
  private readonly adminUserDetailService = inject(AdminUserDetailService);
  private readonly adminSummaryService = inject(AdminSummaryService);

  private readonly SUMMARY_FILTER: SummaryFilter = 'all';
  private readonly SUMMARY_PAGE_SIZE = 3;

  protected readonly selectedRole = signal<TechmatiRole>('user');

  protected readonly userQuery = injectQuery(() =>
    this.adminUserDetailService.findById(this.userId()),
  );

  protected readonly user = computed(() => this.userQuery.data() ?? null);

  protected readonly summariesQuery = injectQuery(() =>
    this.adminSummaryService.getUserSummaries(this.userId(), {
      page: 1,
      size: this.SUMMARY_PAGE_SIZE,
      filter: this.SUMMARY_FILTER,
      includeEntries: false,
      entriesLimit: 0,
    }),
  );

  protected readonly summaries = computed(() => this.summariesQuery.data()?.data ?? []);
  protected readonly summariesTotal = computed(() => this.summariesQuery.data()?.total ?? 0);

  protected readonly assignRoleMutation = injectMutation(() =>
    this.adminUserDetailService.assignRole(
      this.userId(),
      () => this.onAssignRoleSuccess(),
      () => this.onAssignRoleError(),
    ),
  );

  protected readonly banMutation = injectMutation(() =>
    this.adminUserDetailService.ban(
      this.userId(),
      () => this.onBanSuccess(),
      () => this.onBanError(),
    ),
  );

  protected readonly unbanMutation = injectMutation(() =>
    this.adminUserDetailService.unban(
      this.userId(),
      () => this.onUnbanSuccess(),
      () => this.onUnbanError(),
    ),
  );

  protected readonly isUpdatingBanState = computed(
    () => this.banMutation.isPending() || this.unbanMutation.isPending(),
  );

  protected readonly baseToastConfig: ExternalToast = {
    position: 'bottom-right',
    unstyled: true,
    class:
      'border border-border-subtle bg-card flex gap-2 p-3 items-center justify-center rounded-sm',
  };

  constructor() {
    effect(() => {
      const user = this.user();
      if (user) {
        this.selectedRole.set(user.role);
      }
    });
  }

  protected assignRole(role: TechmatiRole): void {
    if (role === this.user()?.role) {
      this.selectedRole.set(role);
      return;
    }

    this.selectedRole.set(role);
    this.assignRoleMutation.mutate(role);
  }

  protected ban(): void {
    this.banMutation.mutate();
  }

  protected unban(): void {
    this.unbanMutation.mutate();
  }

  private onAssignRoleSuccess(): void {
    toast.success('Rol actualizado con éxito', {
      description: 'Los permisos del usuario se actualizaron correctamente.',
      ...this.baseToastConfig,
    });
  }

  private onAssignRoleError(): void {
    const user = this.user();
    if (user) {
      this.selectedRole.set(user.role);
    }

    toast.error('No se pudo actualizar el rol', {
      description: 'Ocurrió un problema al asignar el nuevo rol. Intenta de nuevo.',
      ...this.baseToastConfig,
    });
  }

  private onBanSuccess(): void {
    toast.success('Usuario baneado con éxito', {
      description: 'El usuario ya no podrá enviar traducciones ni acceder al dashboard.',
      ...this.baseToastConfig,
    });
  }

  private onBanError(): void {
    toast.error('No se pudo banear al usuario', {
      description: 'Ocurrió un problema al aplicar el baneo. Intenta de nuevo.',
      ...this.baseToastConfig,
    });
  }

  private onUnbanSuccess(): void {
    toast.success('Usuario desbaneado con éxito', {
      description: 'El usuario podrá volver a acceder según los permisos de su rol.',
      ...this.baseToastConfig,
    });
  }

  private onUnbanError(): void {
    toast.error('No se pudo desbanear al usuario', {
      description: 'Ocurrió un problema al retirar el baneo. Intenta de nuevo.',
      ...this.baseToastConfig,
    });
  }
}
