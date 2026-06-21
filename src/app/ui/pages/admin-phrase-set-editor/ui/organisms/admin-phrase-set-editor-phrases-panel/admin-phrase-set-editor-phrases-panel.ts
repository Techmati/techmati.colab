import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Phrase } from '@/core/types/phrase.type';

import { AdminPhraseEditorCard } from '../../molecules/admin-phrase-editor-card/admin-phrase-editor-card';

@Component({
  selector: 'tm-admin-phrase-set-editor-phrases-panel',
  imports: [AdminPhraseEditorCard],
  templateUrl: './admin-phrase-set-editor-phrases-panel.html',
  styleUrl: './admin-phrase-set-editor-phrases-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorPhrasesPanel {
  readonly phrases = input.required<readonly Phrase[]>();
}
