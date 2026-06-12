import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GreetingPanelSkeleton } from '../greeting-panel-skeleton/greeting-panel-skeleton';

@Component({
  selector: 'tm-greeting-panel',
  imports: [GreetingPanelSkeleton],
  templateUrl: './greeting-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingPanel {
  private readonly authenticationService = inject(AuthenticationService);

  protected readonly initialized = this.authenticationService.initialized;

  readonly singleName = computed(
    () => this.authenticationService.displayName().split(' ')[0] ?? 'Contribuidor',
  );
}
