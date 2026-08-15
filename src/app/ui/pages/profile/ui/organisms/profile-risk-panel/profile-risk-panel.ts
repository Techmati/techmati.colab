import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-profile-risk-panel',
  imports: [ZardButtonComponent, RouterLink],
  templateUrl: './profile-risk-panel.html',
  styleUrl: './profile-risk-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileRiskPanel {
  readonly isDeleting = input(false);

  readonly deleteRequested = output<void>();
}
