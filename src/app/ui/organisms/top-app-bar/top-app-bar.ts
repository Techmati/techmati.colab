import type { TechmatiRole } from '@/core/dto/profile.dto';
import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { GuestService } from '@/core/service/guest/guest.service';
import { ProfileService } from '@/core/service/profile/profile.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'tm-top-app-bar',
  imports: [ZardButtonComponent, ZardSkeletonComponent, RouterLink],
  templateUrl: './top-app-bar.html',
  styleUrl: './top-app-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopAppBar {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly contributorContext = inject(ContributorContextService);
  private readonly guestService = inject(GuestService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  protected readonly isSigningOut = signal(false);
  protected readonly isGuest = computed(() => this.guestService.isGuest());
  protected readonly profileQuery = injectQuery(() => this.profileService.findCurrent());
  protected readonly profile = computed(() => this.profileQuery.data() ?? null);
  protected readonly contributorLoading = computed(() => this.contributorContext.activeLoading());
  protected readonly activeContributorFirstName = computed(() => {
    const fullName = this.contributorContext.active()?.alias.trim() ?? '';

    return fullName.split(/\s+/)[0] ?? '';
  });

  protected readonly activeContributorInitials = computed(() =>
    this.extractInitials(this.contributorContext.active()?.alias),
  );
  protected readonly roleLabelInitials = computed(() => this.extractInitials(this.roleLabel()));

  protected readonly canAcessAdminPanel = computed(() =>
    this.profileService.canAccessAdminPanel(this.profile()?.role),
  );

  protected readonly canManageContributors = computed(() =>
    this.profileService.canManageContributors(this.profile()?.role),
  );

  private readonly roleLabels: Record<TechmatiRole, string> = {
    root: 'Super Administrador',
    admin: 'Administrador',
    user: 'Usuario',
    moderator: 'Moderador',
    analyst: 'Analista',
    collector: 'Recolector',
  };

  protected readonly roleLabel = computed(() => {
    const role = this.profile()?.role;

    if (!role) {
      return 'Usuario';
    }

    return this.roleLabels[role];
  });

  protected async logout(): Promise<void> {
    this.isSigningOut.set(true);

    try {
      await this.authenticationService.signOut();
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Failed to sign out', error);
    } finally {
      this.isSigningOut.set(false);
    }
  }

  private extractInitials(str: string | null | undefined) {
    if (!str) return '??';
    const parts = str.split(' ').filter((part) => part.length > 0);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';

    return `${first}${last}`.toUpperCase();
  }
}
