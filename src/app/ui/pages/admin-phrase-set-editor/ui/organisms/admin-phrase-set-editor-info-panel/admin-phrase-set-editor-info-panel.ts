import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { PhraseSet } from '@/core/types/phrase-set.type';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'tm-admin-phrase-set-editor-info-panel',
  imports: [ZardInputDirective],
  templateUrl: './admin-phrase-set-editor-info-panel.html',
  styleUrl: './admin-phrase-set-editor-info-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorInfoPanel {
  readonly phraseSet = input.required<PhraseSet>();
}
