import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';

import { injectQuery } from '@tanstack/angular-query-experimental';
import { AdminPhraseSetService } from '../admin-phrase-sets/core/service/admin-phrase-set/admin-phrase-set.service';
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
  private readonly adminPhraseSetService = inject(AdminPhraseSetService);

  readonly phraseSetQuery = injectQuery(() =>
    this.adminPhraseSetService.findById(this.phraseSetId()),
  );

  readonly phraseSet = computed(() => this.phraseSetQuery.data()?.phraseSet ?? null);

  readonly phraseSetPhrasesQuery = injectQuery(() =>
    this.adminPhraseSetService.findPhrases(this.phraseSetId(), { page: 1, size: 100 }),
  );

  readonly phrases = computed(() => this.phraseSetPhrasesQuery.data()?.phrases ?? []);
  constructor() {
    effect(() => {
      console.log('phraseSet', this.phraseSet());
    });
  }
}
