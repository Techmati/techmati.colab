import { ZardDividerComponent } from '@/shared/components/divider';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tm-source-text-panel',
  imports: [ZardDividerComponent],
  templateUrl: './source-text-panel.html',
  styleUrl: './source-text-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceTextPanel {
  readonly text = input<string | null | undefined>();
  readonly context = input<string | null | undefined>();
  readonly sourceLanguage = input<string | null | undefined>();
}
