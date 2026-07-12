import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { type Profile, type TechmatiRole } from '@/core/dto/profile.dto';
import { AdminUserDetailField } from '../../molecules/admin-user-detail-field/admin-user-detail-field';

@Component({
  selector: 'tm-admin-user-attributes-panel',
  imports: [DatePipe, AdminUserDetailField],
  templateUrl: './admin-user-attributes-panel.html',
  styleUrl: './admin-user-attributes-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserAttributesPanel {
  readonly user = input.required<Profile>();

  protected readonly roleLabels: Record<TechmatiRole, string> = {
    root: 'Super Administrador',
    admin: 'Administrador',
    moderator: 'Moderador',
    analyst: 'Analista',
    collector: 'Recolector',
    user: 'Usuario',
  };
}
