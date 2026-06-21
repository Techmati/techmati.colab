import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-admin-phrase-set-editor-actions',
  imports: [ZardButtonComponent],
  templateUrl: './admin-phrase-set-editor-actions.html',
  styleUrl: './admin-phrase-set-editor-actions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorActions {}
