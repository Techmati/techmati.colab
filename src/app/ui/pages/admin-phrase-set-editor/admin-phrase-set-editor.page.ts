import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { Phrase } from '@/core/types/phrase.type';
import type { PhraseSet } from '@/core/types/phrase-set.type';

import { AdminPhraseSetEditorActions } from './ui/organisms/admin-phrase-set-editor-actions/admin-phrase-set-editor-actions';
import { AdminPhraseSetEditorInfoPanel } from './ui/organisms/admin-phrase-set-editor-info-panel/admin-phrase-set-editor-info-panel';
import { AdminPhraseSetEditorPhrasesPanel } from './ui/organisms/admin-phrase-set-editor-phrases-panel/admin-phrase-set-editor-phrases-panel';
import { AdminPhraseSetEditorTopBar } from './ui/organisms/admin-phrase-set-editor-top-bar/admin-phrase-set-editor-top-bar';

@Component({
  selector: 'tm-admin-phrase-set-editor-page',
  imports: [
    AdminPhraseSetEditorTopBar,
    AdminPhraseSetEditorInfoPanel,
    AdminPhraseSetEditorPhrasesPanel,
    AdminPhraseSetEditorActions,
  ],
  templateUrl: './admin-phrase-set-editor.page.html',
  styleUrl: './admin-phrase-set-editor.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorPage {
  readonly phraseSetId = input.required<string>();

  protected readonly phraseSet: PhraseSet = {
    id: 'jlkajsdf-lkjaflsdkfja-lkjfalsdkfaj-lakdfjalkj',
    title: 'Frases de Emergencia Médica',
    description:
      'Set de frases comunes utilizadas en situaciones de atención médica de primer contacto.',
    language: 'nahuatl_to_spanish',
    published: true,
    createdAt: '2026-06-18T10:00:00.000Z',
    publishedAt: '2026-06-19T12:00:00.000Z',
    phraseCount: 3,
  };

  protected readonly phrases: readonly Phrase[] = [
    {
      id: 'phrase-1',
      phraseSetId: this.phraseSet.id,
      sourceText: '¿Dónde le duele?',
      context: '',
      position: 1,
      language: 'spanish_to_nahuatl',
      createdAt: '2026-06-18T10:01:00.000Z',
      updatedAt: '2026-06-18T10:01:00.000Z',
    },
    {
      id: 'phrase-2',
      phraseSetId: this.phraseSet.id,
      sourceText: '¿Tiene alguna alergia a medicamentos?',
      context: '',
      position: 2,
      language: 'spanish_to_nahuatl',
      createdAt: '2026-06-18T10:02:00.000Z',
      updatedAt: '2026-06-18T10:02:00.000Z',
    },
    {
      id: 'phrase-3',
      phraseSetId: this.phraseSet.id,
      sourceText: 'Necesitamos tomar una muestra de sangre.',
      context: '',
      position: 3,
      language: 'spanish_to_nahuatl',
      createdAt: '2026-06-18T10:03:00.000Z',
      updatedAt: '2026-06-18T10:03:00.000Z',
    },
  ];
}
