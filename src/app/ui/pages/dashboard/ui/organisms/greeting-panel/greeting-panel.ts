import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
} from '@angular/core';

@Component({
  selector: 'tm-greeting-panel',
  imports: [],
  templateUrl: './greeting-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingPanel {
  private readonly authenticationService = inject(AuthenticationService);

  readonly loading = output<boolean>();

  readonly singleName = computed(
    () => this.authenticationService.displayName().split(' ')[0] ?? 'Contribuidor',
  );

  constructor() {
    effect(() => {
      this.loading.emit(!this.authenticationService.initialized());
    });
  }
}
