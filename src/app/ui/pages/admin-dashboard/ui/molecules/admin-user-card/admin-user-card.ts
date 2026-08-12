import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Profile } from '@/core/dto/profile.dto';

@Component({
  selector: 'tm-admin-user-card',
  imports: [],
  templateUrl: './admin-user-card.html',
  styleUrl: './admin-user-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserCard {
  readonly user = input.required<Profile>();

  readonly displayName = computed(() => {
    const fullName = this.user().fullName?.trim();
    return fullName || this.user().username || 'No proporcionado';
  });

  readonly initials = computed(() => {
    const parts = this.displayName().split(' ').filter((part) => part.length > 0);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
    return `${first}${last}`.toUpperCase() || '??';
  });

  readonly role = computed(
    () =>
      ({
        root: 'Super Administrador',
        admin: 'Administrador',
        user: 'Usuario',
        moderator: 'Moderador',
        analyst: 'Analista',
        collector: 'Recolector',
      })[this.user().role],
  );
}
