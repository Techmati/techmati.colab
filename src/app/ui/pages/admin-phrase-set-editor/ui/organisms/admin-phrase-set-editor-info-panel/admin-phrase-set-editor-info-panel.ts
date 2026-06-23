import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

import type { PhraseSet } from '@/core/types/phrase-set.type';
import { clone } from '@/core/utils/clone.util';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardSwitchComponent } from '@/shared/components/switch';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';
import { form, FormField, required } from '@angular/forms/signals';

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
  readonly phraseSetDraft = signal<PhraseSet>(EMPTY_PHRASE_SET);

  readonly phraseSetForm = form(this.phraseSetDraft, (path) => {
    required(path.title, { message: 'No se puede subir un set de frases sin titulo.' });
    required(path.description, { message: 'No se puede subir un set de frases sin descripción.' });
  });

  protected readonly languageOptions = [
    { label: 'Nahuatl a Español', value: 'nahuatl_to_spanish' },
    { label: 'Español a Nahuatl', value: 'spanish_to_nahuatl' },
  ] as const;

  protected print() {
    console.log(this.phraseSetDraft());
  }

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

const EMPTY_PHRASE_SET: PhraseSet = {
  id: '',
  title: 'Frases de Emergencia Médica',
  description:
    'Set de frases comunes utilizadas en situaciones de atención médica de primer contacto.',
  language: 'nahuatl_to_spanish',
  published: true,
  createdAt: '2026-06-18T10:00:00.000Z',
  publishedAt: '2026-06-19T12:00:00.000Z',
  phraseCount: 3,
};
