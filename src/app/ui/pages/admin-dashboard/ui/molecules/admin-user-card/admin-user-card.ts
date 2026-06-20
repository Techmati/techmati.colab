import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { AdminUserPreview } from '../../../admin-dashboard.types';

@Component({
  selector: 'tm-admin-user-card',
  imports: [],
  templateUrl: './admin-user-card.html',
  styleUrl: './admin-user-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserCard {
  readonly user = input.required<AdminUserPreview>();
}
