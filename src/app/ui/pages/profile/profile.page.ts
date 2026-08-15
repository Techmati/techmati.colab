import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  type TemplateRef,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { toast } from 'ngx-sonner';

import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { ContributorService } from '@/core/service/contributor/contributor.service';
import { GuestService } from '@/core/service/guest/guest.service';
import { ProfileService } from '@/core/service/profile/profile.service';
import { baseToastConfig } from '@/core/view/base-toast.config';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';

import { ProfileAccountPanel, type ProfileAccountPayload } from './ui/organisms/profile-account-panel/profile-account-panel';
import { ProfileContributorPanel, type ContributorAttributesPayload } from './ui/organisms/profile-contributor-panel/profile-contributor-panel';
import { ProfileInfoHeader } from './ui/organisms/profile-info-header/profile-info-header';
import { ProfileRiskPanel } from './ui/organisms/profile-risk-panel/profile-risk-panel';
import { ProfileTopBar } from './ui/organisms/profile-top-bar/profile-top-bar';

@Component({
  selector: 'tm-profile-page',
  imports: [
    ZardSkeletonComponent,
    ProfileTopBar,
    ProfileInfoHeader,
    ProfileContributorPanel,
    ProfileAccountPanel,
    ProfileRiskPanel,
  ],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage {
  protected readonly collectorWarning = viewChild<TemplateRef<unknown>>('collectorWarning');

  private readonly alertDialog = inject(ZardAlertDialogService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly contributorContext = inject(ContributorContextService);
  private readonly contributorService = inject(ContributorService);
  private readonly guestService = inject(GuestService);
  private readonly profileService = inject(ProfileService);
  private readonly queryClient = inject(QueryClient);
  private readonly router = inject(Router);

  protected readonly isGuest = computed(() => this.guestService.isGuest());

  protected readonly profileQuery = injectQuery(() => this.profileService.findCurrent());
  protected readonly profile = computed(() => this.profileQuery.data() ?? null);

  protected readonly activeContributor = computed(() => this.contributorContext.active());
  protected readonly contributorLoading = computed(() => this.contributorContext.activeLoading());
  protected readonly profileLoading = computed(() => this.profileQuery.isPending());

  protected readonly contributorsList = injectQuery(() => ({
    ...this.contributorService.list(),
    enabled: !this.guestService.isGuest(),
  }));

  protected readonly canManageContributors = computed(() =>
    this.profileService.canManageContributors(this.profile()?.role),
  );

  protected readonly hasManagedContributors = computed(() =>
    (this.contributorsList.data() ?? []).some((contributor) => contributor.accountUserId === null),
  );

  protected readonly displayName = computed(() => {
    const alias = this.activeContributor()?.alias?.trim();
    if (this.isGuest()) {
      return alias || 'Invitado';
    }
    const fullName = this.profile()?.fullName?.trim();
    return fullName || alias || this.profile()?.username || 'Invitado';
  });

  protected readonly handle = computed(() => {
    if (this.isGuest()) {
      return 'Invitado';
    }
    const username = this.profile()?.username;
    return username ? `@${username}` : 'Invitado';
  });

  protected readonly initials = computed(() => this.extractInitials(this.displayName()));

  protected readonly isSavingContributor = computed(
    () => this.updateContributorMutation.isPending() || this.updateGuestContributorMutation.isPending(),
  );

  protected readonly isSavingProfile = computed(() => this.updateProfileMutation.isPending());

  protected readonly isDeleting = computed(
    () => this.deleteProfileMutation.isPending() || this.deleteGuestMutation.isPending(),
  );

  protected readonly updateProfileMutation = injectMutation(() => ({
    ...this.profileService.update(),
    onSuccess: () => void this.onProfileUpdateSuccess(),
    onError: () => this.onMutationError('No se pudo actualizar el perfil'),
  }));

  protected readonly updateContributorMutation = injectMutation(() => ({
    ...this.contributorService.update(),
    onSuccess: () => this.onContributorUpdateSuccess(),
    onError: () => this.onMutationError('No se pudo guardar el contribuidor'),
  }));

  protected readonly updateGuestContributorMutation = injectMutation(() => ({
    ...this.guestService.updateContributor(),
    onSuccess: () => void this.onGuestContributorUpdateSuccess(),
    onError: () => this.onMutationError('No se pudo guardar el contribuidor'),
  }));

  protected readonly deleteProfileMutation = injectMutation(() => ({
    ...this.profileService.delete(),
    onSuccess: () => void this.onDeleteAccountSuccess(),
    onError: () => this.onMutationError('No se pudo eliminar la cuenta'),
  }));

  protected readonly deleteGuestMutation = injectMutation(() => ({
    ...this.guestService.deleteContributor(),
    onSuccess: () => this.onDeleteGuestSuccess(),
    onError: () => this.onMutationError('No se pudo eliminar la cuenta'),
  }));

  protected onContributorSave(payload: ContributorAttributesPayload): void {
    if (this.isGuest()) {
      this.updateGuestContributorMutation.mutate(payload);
      return;
    }

    const contributor = this.activeContributor();
    if (!contributor) return;
    this.updateContributorMutation.mutate({ id: contributor.id, ...payload });
  }

  protected onAccountSave(payload: ProfileAccountPayload): void {
    this.updateProfileMutation.mutate(payload);
  }

  protected onDeleteRequested(): void {
    const showCollectorWarning = this.canManageContributors() && this.hasManagedContributors();

    this.alertDialog.confirm({
      zTitle: '¿Eliminar tu cuenta?',
      zDescription:
        'Techmati eliminará todos los datos de ti de sus servidores, incluyendo perfil, datos como contribuidor y contribuciones. Esta acción es irreversible.',
      zContent: showCollectorWarning ? this.collectorWarning() : undefined,
      zCancelText: 'Cancelar',
      zOkText: 'Sí, eliminar',
      zOkDestructive: true,
      zOnOk: () => {
        if (this.isGuest()) {
          this.deleteGuestMutation.mutate();
        } else {
          this.deleteProfileMutation.mutate();
        }
      },
    });
  }

  private onContributorUpdateSuccess(): void {
    this.contributorService.invalidateContributorsList();
    toast.success('Contribuidor actualizado', {
      description: 'Los atributos del contribuidor se guardaron correctamente.',
      ...baseToastConfig,
    });
  }

  private async onGuestContributorUpdateSuccess(): Promise<void> {
    await this.queryClient.invalidateQueries({ queryKey: ['guest', 'contributor'] });
    toast.success('Contribuidor actualizado', {
      description: 'Los atributos del contribuidor se guardaron correctamente.',
      ...baseToastConfig,
    });
  }

  private async onProfileUpdateSuccess(): Promise<void> {
    await this.queryClient.invalidateQueries({ queryKey: ['profile', 'current'] });
    toast.success('Perfil actualizado', {
      description: 'Tus datos de cuenta se guardaron correctamente.',
      ...baseToastConfig,
    });
  }

  private async onDeleteAccountSuccess(): Promise<void> {
    toast.success('Cuenta eliminada', {
      description: 'Tu cuenta y todos tus datos fueron eliminados correctamente.',
      ...baseToastConfig,
    });

    try {
      await this.authenticationService.signOut();
    } catch {
      // The session may already be gone after the wipe; keep navigating.
    }
    void this.router.navigate(['/']);
  }

  private onDeleteGuestSuccess(): void {
    toast.success('Datos eliminados', {
      description: 'Tus datos de invitado fueron eliminados correctamente.',
      ...baseToastConfig,
    });
    this.guestService.clearGuestSession();
    void this.router.navigate(['/']);
  }

  private onMutationError(title: string): void {
    toast.error(title, {
      description: 'Ocurrió un problema al guardar los cambios. Intenta de nuevo.',
      ...baseToastConfig,
    });
  }

  private extractInitials(value: string): string {
    const parts = value.split(' ').filter((part) => part.length > 0);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
    return `${first}${last}`.toUpperCase() || '??';
  }
}
