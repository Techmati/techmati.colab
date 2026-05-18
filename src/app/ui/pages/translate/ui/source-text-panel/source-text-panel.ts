import { ZardDividerComponent } from '@/shared/components/divider';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-source-text-panel',
  imports: [ZardDividerComponent],
  templateUrl: './source-text-panel.html',
  styleUrl: './source-text-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceTextPanel { }
