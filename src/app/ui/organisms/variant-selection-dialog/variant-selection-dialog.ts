import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { injectMutation } from '@tanstack/angular-query-experimental';

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ZardAlertDialogRef, ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { VariantSelectionContent } from '@/ui/pages/translate/ui/organisms/variant-selection-content/variant-selection-content';

@Component({
  selector: 'tm-variant-selection-dialog',
  imports: [],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'variantDialog',
})
export class VariantSelectionDialog {
  readonly phraseSetId = input.required<string>();
  readonly translationCreated = output<string>();
  readonly cancelled = output<void>();

  private readonly dialogService = inject(ZardAlertDialogService);
  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);
  private dialogRef: ZardAlertDialogRef<VariantSelectionContent> | null = null;

  private readonly createMutation = injectMutation(() => {
    const contributor = this.contributorContext.active();
    return this.translationService.create(contributor!.id);
  });

  open(phraseSetId?: string): void {
    const id = phraseSetId ?? this.phraseSetId();
    if (!id) return;
    this.openWithId(id);
  }

  private openWithId(phraseSetId: string): void {
    this.dialogRef = this.dialogService.create({
      zTitle: 'Iniciar traducción',
      zContent: VariantSelectionContent,
      zData: { phraseSetId },
      zCancelText: 'Volver',
      zOkText: 'Iniciar',
      zMaskClosable: false,
      zWidth: '350px',
      zOnOk: (instance) => {
        const variantId = (instance as VariantSelectionContent).getSelectedVariantId();
        this.createMutation.mutate(
          { phraseSetId, variantId },
          {
            onSuccess: (translation) => {
              this.dialogRef?.close();
              this.translationCreated.emit(translation.id);
            },
          },
        );
        console.log(
          'Creating translation with phraseSetId:',
          phraseSetId,
          'and variantId:',
          variantId,
        );
        return false;
      },
      zOnCancel: () => {
        this.cancelled.emit();
      },
    });
  }
}
