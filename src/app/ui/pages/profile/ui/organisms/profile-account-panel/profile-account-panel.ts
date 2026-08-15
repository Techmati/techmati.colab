import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { form, FormField, maxLength, required } from '@angular/forms/signals';

import { type Profile, type TechmatiRole } from '@/core/dto/profile.dto';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';
import { GuestBanner } from '@/ui/molecules/guest-banner/guest-banner';

export interface ProfileAccountPayload {
  fullName: string | null;
  username: string;
}

interface AccountDraft {
  fullName: string;
  username: string;
}

@Component({
  selector: 'tm-profile-account-panel',
  imports: [ZardButtonComponent, ZardInputDirective, FormField, FieldErrorAdvice, GuestBanner],
  templateUrl: './profile-account-panel.html',
  styleUrl: './profile-account-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileAccountPanel {
  readonly profile = input.required<Profile | null>();
  readonly isGuest = input(false);
  readonly isSaving = input(false);

  readonly save = output<ProfileAccountPayload>();

  protected readonly isEditing = signal(false);

  /**
   * Becomes true only when the user actually submits a save. The sync effect uses
   * it to decide whether to auto-exit edit mode once the server data matches the
   * draft, so entering edit mode (which seeds the draft) does not exit immediately.
   */
  private readonly submitted = signal(false);

  protected readonly roleLabels: Record<TechmatiRole, string> = {
    root: 'Super Administrador',
    admin: 'Administrador',
    moderator: 'Moderador',
    analyst: 'Analista',
    collector: 'Recolector',
    user: 'Usuario',
  };

  protected readonly model = signal<AccountDraft>({
    fullName: '',
    username: '',
  });

  protected readonly form = form(this.model, (schema) => {
    required(schema.username, { message: 'El usuario es obligatorio.' });
    maxLength(schema.username, 30, { message: 'El usuario no puede exceder 30 caracteres.' });
  });

  constructor() {
    effect(() => {
      const profile = this.profile();
      if (!profile || this.isGuest()) return;

      if (!this.isEditing()) {
        this.model.set({ fullName: profile.fullName ?? '', username: profile.username });
        return;
      }

      if (!this.submitted()) return;

      const draft = this.model();
      const synced =
        (draft.fullName.trim() || null) === (profile.fullName ?? null) &&
        draft.username.trim() === profile.username;

      if (synced) {
        this.isEditing.set(false);
        this.submitted.set(false);
      }
    });
  }

  protected startEditing(): void {
    const profile = this.profile();
    if (!profile) return;
    this.submitted.set(false);
    this.model.set({ fullName: profile.fullName ?? '', username: profile.username });
    this.isEditing.set(true);
  }

  protected cancelEditing(): void {
    const profile = this.profile();
    if (profile) {
      this.model.set({ fullName: profile.fullName ?? '', username: profile.username });
    }
    this.submitted.set(false);
    this.isEditing.set(false);
  }

  protected saveChanges(): void {
    this.form().markAsTouched();
    if (this.form().invalid() || this.isSaving()) return;

    const { fullName, username } = this.model();
    this.submitted.set(true);
    this.save.emit({ fullName: fullName.trim() || null, username: username.trim() });
  }
}
