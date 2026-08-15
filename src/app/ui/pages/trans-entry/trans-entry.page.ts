import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDividerComponent } from '@/shared/components/divider';
import { VariantSelectionDialog } from '@/ui/organisms/variant-selection-dialog/variant-selection-dialog';
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { WavesAudioPlayer } from '../../molecules/waves-audio-player/waves-audio-player';
import { TransEntrySkeleton } from './ui/organisms/trans-entry-skeleton/trans-entry-skeleton';

@Component({
  selector: 'tm-trans-entry-page',
  imports: [
    WavesAudioPlayer,
    ZardButtonComponent,
    ZardDividerComponent,
    TransEntrySkeleton,
    VariantSelectionDialog,
  ],
  templateUrl: './trans-entry.page.html',
  styleUrl: './trans-entry.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransEntryPage {
  readonly translationId = input.required<string>();
  readonly title = input<string>('');

  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly alertDialog = inject(ZardAlertDialogService);

  protected readonly entryRes = injectQuery(() => {
    const contributor = this.contributorContext.active()!;
    const translationId = this.translationId();
    return {
      ...this.translationService.findById(contributor.id, translationId),
      enabled: !!contributor && !!translationId,
    };
  });

  protected readonly entries = computed(() => this.entryRes.data()?.entries ?? []);

  readonly deleteTranslationMutation = injectMutation(() => {
    const contributor = this.contributorContext.active();
    const translationId = this.translationId();
    return this.translationService.delete(
      contributor?.id,
      translationId,
      () => this.onDeleteSuccess(),
    );
  });

  constructor() {
    effect(() => console.log(this.entryRes.data()));
  }

  protected onTranslationCreated(translationId: string): void {
    this.router.navigate(['/translate', translationId]);
  }
  protected goBack(): void {
    this.location.back();
  }

  protected confirmDelete(): void {
    this.alertDialog.confirm({
      zTitle: '¿Eliminar esta contribución?',
      zDescription: 'Se eliminará todo el intento de traducción. Esta acción no se puede deshacer.',
      zCancelText: 'Cancelar',
      zOkText: 'Eliminar',
      zOkDestructive: true,
      zOnOk: () => {
        this.deleteTranslationMutation.mutate();
      },
    });
  }

  private onDeleteSuccess(): void {
    void this.router.navigate(['/dashboard']);
  }
}
