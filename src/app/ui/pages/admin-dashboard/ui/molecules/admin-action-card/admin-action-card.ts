import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { AdminQuickAction } from '../../../types/admin-dashboard.types';

@Component({
  selector: 'tm-admin-action-card',
  imports: [ZardButtonComponent],
  templateUrl: './admin-action-card.html',
  styleUrl: './admin-action-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminActionCard {
  readonly action = input.required<AdminQuickAction>();

  protected readonly buttonClass = computed(() => {
    const action = this.action();

    if (action.variant === 'outline') {
      return [
        'h-12 w-full justify-between rounded-xl border-brand-purple-200 bg-card px-4 text-primary',
        'hover:bg-brand-purple-50 hover:text-primary',
      ].join(' ');
    }

    if (action.tone === 'green') {
      return [
        'h-12 w-full justify-between rounded-xl border-brand-green-600 bg-brand-green-600 px-4 text-white',
        'hover:bg-brand-green-500 hover:text-white',
      ].join(' ');
    }

    return [
      'h-12 w-full justify-between rounded-xl border-brand-purple-600 bg-brand-purple-600 px-4 text-white',
      'hover:bg-brand-purple-500 hover:text-white',
    ].join(' ');
  });
}
