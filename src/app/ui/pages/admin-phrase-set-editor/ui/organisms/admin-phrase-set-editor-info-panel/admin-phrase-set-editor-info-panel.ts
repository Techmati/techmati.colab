import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

import type { PhraseSet } from '@/core/types/phrase-set.type';
import { clone } from '@/core/utils/clone.util';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardSwitchComponent } from '@/shared/components/switch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tm-admin-phrase-set-editor-info-panel',
  imports: [
    ZardInputDirective,
    ...ZardSelectImports,
    ZardSkeletonComponent,
    ZardSwitchComponent,
    FormsModule,
  ],
  templateUrl: './admin-phrase-set-editor-info-panel.html',
  styleUrl: './admin-phrase-set-editor-info-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorInfoPanel {
  readonly phraseSetCache = input.required<PhraseSet | null>();
  readonly phraseSet = signal<PhraseSet | null>(null);

  protected readonly languageOptions = [
    { label: 'Nahuatl a Español', value: 'nahuatl_to_spanish' },
    { label: 'Español a Nahuatl', value: 'spanish_to_nahuatl' },
  ] as const;

  protected print() {
    console.log(this.phraseSet());
  }

  constructor() {
    effect(() => {
      const cache = this.phraseSetCache();
      if (!this.phraseSet() && cache) {
        const phraseSetClone = clone(cache);
        this.phraseSet.set(phraseSetClone);
      }
    });
  }
}
