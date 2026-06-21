import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AdminQuickAction } from '../../../types/admin-dashboard.types';
import { AdminActionCard } from '../../molecules/admin-action-card/admin-action-card';

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
