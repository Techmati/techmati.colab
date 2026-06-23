import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal
} from '@angular/core';

import { PhraseSet } from '@/core/types/phrase-set.type';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { AdminPhraseSetService } from '../../../core/service/admin-phrase-set/admin-phrase-set.service';
import { EMPTY_PHRASE_SET } from './core/defaults/empty-phrase-set.default';
import { PhraseDraft } from './core/types/phrase-derivations.type';
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

  readonly phraseSet = computed(() => this.phraseSetQuery.data()?.phraseSet ?? null);
  readonly phraseSetQuery = injectQuery(() =>
    this.adminPhraseSetService.findById(this.phraseSetId()),
  );

  readonly phrases = computed(() => this.phraseSetPhrasesQuery.data()?.phrases ?? []);
  readonly phraseSetPhrasesQuery = injectQuery(() =>
    this.adminPhraseSetService.findPhrases(this.phraseSetId(), { page: 1, size: 100 }),
  );

  readonly phraseSetUpdateMutation = injectMutation(() =>
    this.adminPhraseSetService.update(this.phraseSetId(), {
      ...this.phraseSetDraft(),
      phrases: this.phrasesDrafts(),
    }),
  );

  readonly saveLoading = computed(() => this.phraseSetUpdateMutation.isPending());

  readonly phraseSetDraft = signal<PhraseSet>(EMPTY_PHRASE_SET);
  readonly phrasesDrafts = signal<PhraseDraft[]>([]);

  protected save() {
    if (this.phraseSetId() !== 'new') {
      this.phraseSetUpdateMutation.mutate();
    }
  }
}
