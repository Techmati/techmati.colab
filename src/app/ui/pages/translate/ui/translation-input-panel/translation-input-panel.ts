import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'tm-translation-input-panel',
  imports: [ZardInputDirective],
  templateUrl: './translation-input-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationInputPanel {}
