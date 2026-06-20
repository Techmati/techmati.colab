import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AdminMetricCard } from '../../molecules/admin-metric-card/admin-metric-card';
import type { AdminMetric } from '../../../admin-dashboard.types';

@Component({
  selector: 'tm-admin-metrics-panel',
  imports: [AdminMetricCard],
  templateUrl: './admin-metrics-panel.html',
  styleUrl: './admin-metrics-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMetricsPanel {
  readonly metrics = input.required<readonly AdminMetric[]>();
}
