import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AdminActionCard } from '../../molecules/admin-action-card/admin-action-card';
import type { AdminQuickAction } from '../../../admin-dashboard.types';

@Component({
  selector: 'tm-admin-quick-actions-panel',
  imports: [AdminActionCard],
  templateUrl: './admin-quick-actions-panel.html',
  styleUrl: './admin-quick-actions-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminQuickActionsPanel {
  readonly actions = input.required<readonly AdminQuickAction[]>();
}
