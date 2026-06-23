import { ChangeDetectionStrategy, Component, computed, effect, input, model } from '@angular/core';

import type { PhraseSet } from '@/core/types/phrase-set.type';
import { clone } from '@/core/utils/clone.util';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardSwitchComponent } from '@/shared/components/switch';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';
import { form, FormField, required } from '@angular/forms/signals';
import { EMPTY_PHRASE_SET } from '../../../core/defaults/empty-phrase-set.default';
import { PhraseSetDraft } from '../../../core/types/phrase-set-derivations.type';

@Component({
  selector: 'tm-admin-phrase-set-editor-info-panel',
  imports: [
    ZardInputDirective,
    ...ZardSelectImports,
    ZardSkeletonComponent,
    ZardSwitchComponent,
    FormField,
    FieldErrorAdvice,
  ],
  templateUrl: './admin-phrase-set-editor-info-panel.html',
  styleUrl: './admin-phrase-set-editor-info-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorInfoPanel {
  readonly phraseSetCache = input.required<PhraseSet | null>();
  readonly isLoading = input.required<boolean>();
  readonly phraseSetDraft = model<PhraseSetDraft>(EMPTY_PHRASE_SET);

  protected readonly phraseSetForm = form(this.phraseSetDraft, (path) => {
    required(path.title, { message: 'No se puede subir un set de frases sin titulo.' });
    required(path.description, { message: 'No se puede subir un set de frases sin descripción.' });
  });

  readonly invalid = computed(() => this.phraseSetForm().invalid());

  protected readonly languageOptions = [
    { label: 'Nahuatl a Español', value: 'nahuatl_to_spanish' },
    { label: 'Español a Nahuatl', value: 'spanish_to_nahuatl' },
  ] as const;

  constructor() {
    effect(() => {
      const cache = this.phraseSetCache();
      if (cache && !this.phraseSetForm().dirty()) {
        const phraseSetClone = clone(cache);
        this.phraseSetDraft.set(phraseSetClone);
      }
    });
  }
}
