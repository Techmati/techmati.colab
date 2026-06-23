import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-admin-phrase-set-editor-actions',
  imports: [ZardButtonComponent],
  templateUrl: './admin-phrase-set-editor-actions.html',
  styleUrl: './admin-phrase-set-editor-actions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorActions {
  private readonly alertDialog = inject(ZardAlertDialogService);

  readonly save = output<void>();
  readonly saveLoading = input.required<boolean>();
  readonly discard = output<void>();

  protected confirmDiscard(): void {
    this.alertDialog.confirm({
      zTitle: '¿Descartar cambios?',
      zDescription:
        'Si sales ahora, se perderán los cambios que todavía no has guardado. Puedes quedarte y seguir editando si lo prefieres.',
      zCancelText: 'Seguir editando',
      zOkText: 'Sí, descartar',
      zOkDestructive: true,
      zOnOk: () => {
        this.discard.emit();
      },
    });
  }
}
