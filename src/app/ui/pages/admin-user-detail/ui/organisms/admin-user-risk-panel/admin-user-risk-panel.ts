import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import { TECHMATI_ROLES, type TechmatiRole } from '@/core/dto/profile.dto';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSelectImports } from '@/shared/components/select';

interface RoleOption {
  readonly label: string;
  readonly value: TechmatiRole;
}

@Component({
  selector: 'tm-admin-user-risk-panel',
  imports: [ZardButtonComponent, ...ZardSelectImports],
  templateUrl: './admin-user-risk-panel.html',
  styleUrl: './admin-user-risk-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserRiskPanel {
  readonly role = model<TechmatiRole>('user');
  readonly isBanned = input.required<boolean>();
  readonly isAssigningRole = input(false);
  readonly isUpdatingBanState = input(false);
  readonly ban = output<void>();
  readonly unban = output<void>();

  protected readonly roleOptions: readonly RoleOption[] = [
    { label: 'Super Administrador', value: 'root' },
    { label: 'Administrador', value: 'admin' },
    { label: 'Moderador', value: 'moderator' },
    { label: 'Analista', value: 'analyst' },
    { label: 'Usuario', value: 'user' },
  ];

  protected onRoleSelectionChange(value: string | string[]): void {
    if (typeof value !== 'string' || !TECHMATI_ROLES.includes(value as TechmatiRole)) {
      return;
    }

    this.role.set(value as TechmatiRole);
  }

  protected toggleBanState(): void {
    if (this.isBanned()) {
      this.unban.emit();
      return;
    }

    this.ban.emit();
  }
}
