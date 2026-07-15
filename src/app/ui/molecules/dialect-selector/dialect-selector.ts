import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import type { NahuatlVariant } from '@/core/types/nahuatl-variant.type';
import { ZardSelectImports } from '@/shared/components/select';

@Component({
  selector: 'tm-dialect-selector',
  imports: [...ZardSelectImports],
  templateUrl: './dialect-selector.html',
  styleUrl: './dialect-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialectSelector {
  readonly variants = input.required<NahuatlVariant[]>();
  readonly selected = model<string>('');
  readonly disabled = model(false);
}