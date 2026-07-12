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

  readonly initials = computed(() => {
    const [firstName, lastName] = this.user().fullName.split(' ');
    return `${firstName[0]}${lastName[0]}`;
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
