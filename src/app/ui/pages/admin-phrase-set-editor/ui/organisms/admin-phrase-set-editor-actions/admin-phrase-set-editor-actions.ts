import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-admin-phrase-set-editor-actions',
  imports: [ZardButtonComponent],
  templateUrl: './admin-phrase-set-editor-actions.html',
  styleUrl: './admin-phrase-set-editor-actions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorActions {
  readonly save = output<void>();
  readonly saveLoading = input.required<boolean>();
  readonly discard = output<void>();
  readonly discardLoading = input.required<boolean>();
  readonly delete = output<void>();
  readonly deleteLoading = input.required<boolean>();
}
