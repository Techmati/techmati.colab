import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Phrase } from '@/core/types/phrase.type';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'tm-admin-phrase-editor-card',
  imports: [ZardInputDirective],
  templateUrl: './admin-phrase-editor-card.html',
  styleUrl: './admin-phrase-editor-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseEditorCard {
  readonly phrase = input.required<Phrase>();
}
