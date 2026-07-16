import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';

import { injectMutation } from '@tanstack/angular-query-experimental';

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ZardAlertDialogRef, ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { DialectSelectionContent } from '@/ui/pages/translate/ui/organisms/dialect-selection-content/dialect-selection-content';

@Component({
  selector: 'tm-dialect-selection-dialog',
  imports: [],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialectSelectionDialog {
  readonly phraseSetId = input<string | null>(null);
  readonly translationCreated = output<string>();
  readonly cancelled = output<void>();

  private readonly dialogService = inject(ZardAlertDialogService);
  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);
  private dialogRef: ZardAlertDialogRef<DialectSelectionContent> | null = null;

  private readonly createMutation = injectMutation(() =>
    this.translationService.create(this.contributorContext.activeId()!),
  );

  constructor() {
    effect(() => {
      const psId = this.phraseSetId();
      if (psId) {
        this.openDialog(psId);
      }
    });
  }

  private openDialog(phraseSetId: string): void {
    this.dialogRef = this.dialogService.create({
      zTitle: 'Iniciar traducción',
      zContent: DialectSelectionContent,
      zData: { phraseSetId },
      zCancelText: 'Volver',
      zOkText: 'Iniciar',
      zMaskClosable: false,
      zWidth: '350px',
      zOnOk: (instance) => {
        const dialectId = (instance as DialectSelectionContent).getSelectedDialectId();
        this.createMutation.mutate(
          { phraseSetId, dialectId },
          {
            onSuccess: (translation) => {
              this.dialogRef?.close();
              this.translationCreated.emit(translation.id);
            },
          },
        );
        return false;
      },
      zOnCancel: () => {
        this.cancelled.emit();
      },
    });
  }
}

