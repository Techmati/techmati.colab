import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { PhraseSet } from '@/core/types/phrase-set.type';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';

@Component({
  selector: 'tm-admin-phrase-set-editor-info-panel',
  imports: [ZardInputDirective, ...ZardSelectImports, ZardSkeletonComponent],
  templateUrl: './admin-phrase-set-editor-info-panel.html',
  styleUrl: './admin-phrase-set-editor-info-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorInfoPanel {
  readonly phraseSet = input.required<PhraseSet | null>();

  protected readonly languageOptions = [
    { label: 'Nahuatl a Español', value: 'nahuatl_to_spanish' },
    { label: 'Español to Nahuatl', value: 'spanish_to_nahuatl' },
  ] as const;
}
