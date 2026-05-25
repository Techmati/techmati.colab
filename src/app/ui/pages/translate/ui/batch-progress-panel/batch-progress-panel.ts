import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tm-batch-progress-panel',
  imports: [],
  templateUrl: './batch-progress-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchProgressPanel {
  readonly progressPercentage = input<number | null | undefined>(0);
  readonly contributedEntriesCount = input<number | null | undefined>(0);
  readonly totalPhrases = input<number | null | undefined>(0);
}
