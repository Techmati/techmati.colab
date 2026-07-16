import { ProfileService } from '@/core/service/profile/profile.service';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'tm-bottom-nav-bar',
  imports: [RouterLink],
  templateUrl: './bottom-nav-bar.html',
  styleUrl: './bottom-nav-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavBar {
  readonly active = input<'dashboard' | 'profile' | 'contributors'>('dashboard');

  private readonly profileService = inject(ProfileService);

  private readonly profile = injectQuery(() => this.profileService.findCurrent());

  protected readonly canManageContributors = computed(() => {
    const role = this.profile.data()?.role;
    if (!role) {
      return false;
    }
    return this.profileService.canManageContributors(role);
  });
}
