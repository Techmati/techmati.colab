import { ZardButtonComponent } from '@/shared/components/button';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-in-progress-panel',
  imports: [ZardButtonComponent],
  templateUrl: './in-progress-panel.html',
  styleUrl: './in-progress-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InProgressPanel {
  protected readonly cards = [1, 2];
}
