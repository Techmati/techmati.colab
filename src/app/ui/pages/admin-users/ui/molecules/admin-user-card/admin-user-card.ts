import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { type Profile, type TechmatiRole } from '@/core/dto/profile.dto';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tm-admin-user-card',
  imports: [DatePipe, RouterLink, ZardBadgeComponent, ZardButtonComponent],
  templateUrl: './admin-user-card.html',
  styleUrl: './admin-user-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserCard {
  readonly user = input.required<Profile>();

  protected readonly displayName = computed(() => {
    const fullName = this.user().fullName?.trim();
    return fullName || this.user().username || 'No proporcionado';
  });

  protected readonly initials = computed(() => {
    const parts = this.displayName().split(' ').filter((part) => part.length > 0);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';

    return `${first}${last}`.toUpperCase() || '??';
  });

  protected readonly roleLabels: Record<TechmatiRole, string> = {
    root: 'Super Administrador',
    admin: 'Administrador',
    moderator: 'Moderador',
    analyst: 'Analista',
    collector: 'Recolector',
    user: 'Usuario',
  };

  protected readonly roleIconClasses: Record<TechmatiRole, string> = {
    root: 'ri--admin-line',
    admin: 'ri--admin-line',
    moderator: 'ri--shield-user-line',
    analyst: 'ri--file-search-line',
    collector: 'ri--group-line',
    user: 'lucide--user-round',
  };

  protected readonly roleBadgeClasses: Record<TechmatiRole, string> = {
    root: 'bg-primary text-primary-foreground',
    admin: 'bg-secondary text-secondary-foreground',
    moderator: 'bg-primary text-primary-foreground',
    analyst: 'bg-primary-500 text-white',
    collector: 'bg-primary-500 text-white',
    user: 'bg-card text-foreground border-border',
  };

  protected readonly avatarClasses = computed(() => {
    const role = this.user().role;

    return {
      root: 'bg-primary-100 text-primary',
      admin: 'bg-[var(--muted)] text-[var(--foreground)]',
      moderator: 'bg-primary-100 text-[var(--primary)]',
      analyst: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
      collector: 'bg-primary-200 text-primary',
      user: 'bg-[var(--muted)] text-[var(--foreground)]',
    }[role];
  });
}
