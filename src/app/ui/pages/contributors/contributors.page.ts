import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { ContributorService } from '@/core/service/contributor/contributor.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDialogService } from '@/shared/components/dialog';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ActiveContributorCard } from './ui/molecules/active-contributor-card/active-contributor-card';
import { ContributorCard } from './ui/molecules/contributor-card/contributor-card';
import { ContributorsHeader } from './ui/organisms/contributors-header/contributors-header';
import {
  type ContributorFormModel,
  ContributorFormContent,
} from './ui/molecules/contributor-form-content/contributor-form-content';

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

  readonly contributorsList = injectQuery(() => this.contributorService.list());
  readonly activeContributor = computed(() => this.contributorContext.active());

  protected readonly inactiveContributors = computed(() =>
    this.contributorsList
      .data()
      ?.filter((contributor) => contributor.id != this.activeContributor()?.id),
  );

  protected readonly total = computed(() => this.contributorsList.data()?.length || 0);

  protected onActivate(id: string): void {
    void id;
  }

  protected onEdit(id: string): void {
    const contributor = this.contributorsList.data()?.find((c) => c.id === id);
    if (!contributor) return;
    this.openDialog(false, contributor);
  }

  protected onRemove(id: string): void {
    void id;
  }

  protected onNewContributor(): void {
    this.openDialog(true);
  }

  private openDialog(isCreate: boolean, contributor?: import('@/core/types/contributor.type').Contributor): void {
    this.dialogService.create<ContributorFormContent, ContributorFormModel>({
      zTitle: isCreate ? 'Nuevo colaborador' : 'Editar colaborador',
      zDescription: isCreate
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
        this.onDialogSaved(result);
        return;
      },
    });
  }

  protected onDialogSaved(_payload: ContributorFormModel): void {
    void _payload;
  }
}