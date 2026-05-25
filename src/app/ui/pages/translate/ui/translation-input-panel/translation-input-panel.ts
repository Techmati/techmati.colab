import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

import { ZardInputDirective } from '@/shared/components/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tm-translation-input-panel',
  imports: [ZardInputDirective, FormsModule],
  templateUrl: './translation-input-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationInputPanel {
  readonly targetLanguage = input<string | null | undefined>();
  readonly disabled = input.required<boolean>();

  translation = model('');
}
