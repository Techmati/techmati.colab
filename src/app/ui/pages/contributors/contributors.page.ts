import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { ContributorService } from '@/core/service/contributor/contributor.service';
import { NahuatlVariantService } from '@/core/service/nahuatl-variant/nahuatl-variant.service';
import { Contributor } from '@/core/types/contributor.type';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDialogService } from '@/shared/components/dialog';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
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
  private readonly variantService = inject(NahuatlVariantService);

  private readonly contributorContext = inject(ContributorContextService);
  private readonly dialogService = inject(ZardDialogService);

  readonly contributorsList = injectQuery(() => this.contributorService.list());
  readonly variants = injectQuery(() => this.variantService.list());

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
    this.openDialog('edit', contributor);
  }

  protected onRemove(id: Contributor): void {
    void id;
  }

  protected onNewContributor(): void {
    this.openDialog('create');
  }

  private openDialog(
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
}
