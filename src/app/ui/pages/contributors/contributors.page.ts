import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { ContributorService } from '@/core/service/contributor/contributor.service';
import { Contributor } from '@/core/types/contributor.type';
import { baseToastConfig } from '@/core/view/base-toast.config';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDialogService } from '@/shared/components/dialog';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';
import { ActiveContributorCard } from './ui/molecules/active-contributor-card/active-contributor-card';
import { ContributorCard } from './ui/molecules/contributor-card/contributor-card';
import {
  type ContributorFormModel,
  ContributorFormContent,
} from './ui/molecules/contributor-form-content/contributor-form-content';
import { ContributorsHeader } from './ui/organisms/contributors-header/contributors-header';

type ContributorDialogAction = 'create' | 'edit';
@Component({
  selector: 'tm-contributors-page',
  imports: [
    TopAppBar,
    BottomNavBar,
    ContributorsHeader,
    ActiveContributorCard,
    ContributorCard,
    ZardButtonComponent,
  ],
  templateUrl: './contributors.page.html',
  styleUrl: './contributors.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsPage {
  private readonly contributorService = inject(ContributorService);
  private readonly contributorContext = inject(ContributorContextService);

  private readonly dialogService = inject(ZardDialogService);
  private readonly alertDialog = inject(ZardAlertDialogService);

  readonly contributorsList = injectQuery(() => this.contributorService.list());
  readonly createContributorMutation = injectMutation(() => ({
    ...this.contributorService.create(),
    onSuccess: () => {
      this.contributorService.invalidateContributorsList();
    },
  }));

  readonly updateContributorMutation = injectMutation(() => ({
    ...this.contributorService.update(),
    onSuccess: () => {
      this.contributorService.invalidateContributorsList();
    },
  }));

  readonly deleteContributorMutation = injectMutation(() => ({
    ...this.contributorService.delete(),
    onSuccess: () => {
      this.onDeleteSuccess();
    },
  }));

  readonly activeContributor = computed(() => this.contributorContext.active());

  protected readonly inactiveContributors = computed(() =>
    this.contributorsList
      .data()
      ?.filter((contributor) => contributor.id != this.activeContributor()?.id),
  );

  protected readonly total = computed(() => this.contributorsList.data()?.length || 0);

  protected onActivate(contributor: Contributor): void {
    this.contributorContext.setActive(contributor);
  }

  protected onEdit({ id }: Contributor): void {
    const contributor = this.contributorsList.data()?.find((c) => c.id === id);
    if (!contributor) return;
    this.openCreateUpdateDialog('edit', contributor);
  }

  protected onRemove({ id }: Contributor): void {
    this.openDeleteDialog(id);
  }

  protected onNewContributor(): void {
    this.openCreateUpdateDialog('create');
  }

  private openCreateUpdateDialog(
    action: ContributorDialogAction,
    contributor?: import('@/core/types/contributor.type').Contributor,
  ): void {
    this.dialogService.create<ContributorFormContent, ContributorFormModel>({
      zTitle: action ? 'Nuevo colaborador' : 'Editar colaborador',
      zDescription:
        action == 'create'
          ? 'Completa los datos para registrar un nuevo colaborador.'
          : 'Haz los cambios necesarios para este colaborador.',
      zContent: ContributorFormContent,
      zData: { contributor: contributor ?? null } as any,
      zCancelText: 'Cancelar',
      zOkText: 'Guardar cambios',
      zWidth: '384px',
      zOnOk: (instance: ContributorFormContent) => {
        const result = instance.validateAndSave();
        if (result === false) return false;
        this.onDialogConfirmation(result, action);
        return;
      },
    });
  }

  protected onDialogConfirmation(
    { id, fullName, variants }: ContributorFormModel,
    action: ContributorDialogAction,
  ): void {
    const payload = {
      fullName,
      variantIds: variants.map((v) => v.id),
    };
    if (action === 'create') {
      this.createContributorMutation.mutate(payload);
    } else if (action === 'edit') {
      this.updateContributorMutation.mutate({ id, ...payload });
    }
  }
  protected openDeleteDialog(id: string): void {
    this.alertDialog.confirm({
      zTitle: '¿Eliminar contribuidor?',
      zDescription:
        'Si eliminas este contribuidor, no podrás recuperarlo. Esta acción es irreversible. Las traducciones asociadas tambien se eliminarán. ¿Deseas continuar?',
      zCancelText: 'Cancelar',
      zOkText: 'Sí, eliminar',
      zOkDestructive: true,
      zOnOk: () => {
        this.deleteContributorMutation.mutate(id);
      },
    });
  }

  private onDeleteSuccess(): void {
    this.contributorService.invalidateContributorsList();
    toast.success('Contribuidor eliminado', {
      description: 'El contribuidor ha sido eliminado correctamente.',
      ...baseToastConfig,
    });
  }
}
