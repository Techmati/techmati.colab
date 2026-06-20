import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { AdminMetric } from '../../../admin-dashboard.types';

@Component({
  selector: 'tm-admin-metric-card',
  imports: [NgClass],
  templateUrl: './admin-metric-card.html',
  styleUrl: './admin-metric-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMetricCard {
  readonly metric = input.required<AdminMetric>();

  protected readonly accentClass = computed(() =>
    this.metric().tone === 'green' ? 'border-brand-green-500' : 'border-brand-purple-500',
  );

  protected readonly iconClass = computed(() =>
    this.metric().tone === 'green'
      ? 'bg-brand-green-100 text-brand-green-600'
      : 'bg-brand-purple-100 text-primary',
  );
}
