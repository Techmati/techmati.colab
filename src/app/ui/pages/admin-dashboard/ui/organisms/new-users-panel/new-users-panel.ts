import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

import { AdminUserCard } from '../../molecules/admin-user-card/admin-user-card';
import type { AdminUserPreview } from '../../../admin-dashboard.types';

@Component({
  selector: 'tm-new-users-panel',
  imports: [AdminUserCard, ZardButtonComponent],
  templateUrl: './new-users-panel.html',
  styleUrl: './new-users-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewUsersPanel {
  readonly users = input.required<readonly AdminUserPreview[]>();
}
