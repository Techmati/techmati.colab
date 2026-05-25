import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-bottom-action-bar',
  imports: [ZardButtonComponent],
  templateUrl: './bottom-action-bar.html',
  styleUrl: './bottom-action-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomActionBar {
  continueClick = output<void>();
}
