import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { PHRASE_SET_CATEGORY_LABELS } from '@/core/config/phrase-set-category-labels.config';
import { PhraseSet } from '@/core/types/phrase-set.type';
import { baseToastConfig } from '@/core/view/base-toast.config';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ZardToastComponent } from '@/shared/components/toast';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { AdminPhraseSetService } from '../../../../../../core/service/admin-phrase-set/admin-phrase-set.service';

// TODO: change budget sizes in angular.json

@Component({
  selector: 'tm-admin-phrase-set-card',
  imports: [ZardBadgeComponent, ZardButtonComponent, ZardSkeletonComponent, RouterLink, ZardToastComponent],
  templateUrl: './admin-phrase-set-card.html',
  styleUrl: './admin-phrase-set-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetCard {
  readonly phraseSet = input.required<PhraseSet>();
  protected readonly isExpanded = signal(false);

  private readonly adminPhraseSetService = inject(AdminPhraseSetService);
  private readonly alertDialog = inject(ZardAlertDialogService);

  private readonly location = inject(Location);

  readonly phrases = injectQuery(() =>
    this.adminPhraseSetService.findPhrases(this.phraseSet().id, { page: 1, size: 3 }),
  );

  readonly previewPhrases = computed(() => this.phrases.data()?.data || []);

  readonly deleteMutation = injectMutation(() => ({
    ...this.adminPhraseSetService.delete(this.phraseSet().id),
    onSuccess: () => this.onDeleteSuccess(),
    onError: () => this.onDeleteError(),
  }));

  protected readonly badgeLabel = computed(() =>
    this.phraseSet().published ? 'PUBLICADO' : 'BORRADOR',
  );
  protected readonly categoryLabel = computed(
    () => PHRASE_SET_CATEGORY_LABELS[this.phraseSet().category],
  );
  protected readonly badgeClass = computed(() =>
    this.phraseSet().published
      ? 'shrink-0 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-600'
      : 'shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground',
  );

  protected readonly cardClass = computed(() =>
    [
      'rounded-xl bg-card p-4 shadow-sm transition-all duration-300 ease-out',
      this.isExpanded()
        ? 'border-2 border-primary -translate-y-px'
        : 'border border-border hover:border-primary-200',
    ].join(' '),
  );

  protected readonly chevronClass = computed(() =>
    [
      'lucide--chevron-right text-xl transition-transform duration-300 ease-out',
      this.isExpanded() ? 'rotate-90 text-primary' : 'text-border',
    ].join(' '),
  );

  protected readonly detailsClass = computed(() =>
    [
      'grid origin-top transition-all duration-300 ease-out',
      this.isExpanded()
        ? 'grid-rows-[1fr] scale-y-100 opacity-100'
        : 'grid-rows-[0fr] scale-y-95 opacity-0',
    ].join(' '),
  );

  protected toggleExpanded(): void {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  readonly deleteLoading = computed(() => this.deleteMutation.isPending());

  protected confirmDelete(): void {
    this.alertDialog.confirm({
      zTitle: '¿Eliminar set de frases?',
      zDescription:
        'Si eliminas este set de frases, no podrás recuperarlo. Esta acción es irreversible. Las traducciones asociadas tambien se eliminarán. ¿Deseas continuar?',
      zCancelText: 'Cancelar',
      zOkText: 'Sí, eliminar',
      zOkDestructive: true,
      zOnOk: () => {
        this.delete();
      },
    });
  }

  protected delete(): void {
    this.deleteMutation.mutate();
  }
  private onDeleteSuccess(): void {
    toast.success('Set de frases eliminado con éxito', {
      description: 'El set de frases ha sido eliminado correctamente.',
      ...baseToastConfig,
    });
    this.adminPhraseSetService.invalidateSearch();
    this.location.back();
  }

  private onDeleteError(): void {
    toast.error('No se pudo eliminar el set de frases', {
      description:
        'Ocurrió un problema al eliminar el set de frases. Revisa tu conexión e intenta eliminar de nuevo.',
      ...baseToastConfig,
    });
  }
}
