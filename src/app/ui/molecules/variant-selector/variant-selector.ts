import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import type { LanguageVariant } from '@/core/types/language-variant.type';

@Component({
  selector: 'tm-variant-selector',
  imports: [],
  templateUrl: './variant-selector.html',
  styleUrl: './variant-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariantSelector {
  readonly variants = input.required<LanguageVariant[]>();
  readonly selected = model<string>('');

  protected variantName(v: LanguageVariant): string {
    return v.autodenominacion ? `${v.name} (${v.autodenominacion})` : v.name;
  }
}
