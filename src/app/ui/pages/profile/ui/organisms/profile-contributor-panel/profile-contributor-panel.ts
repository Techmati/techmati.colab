import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required } from '@angular/forms/signals';

import type { Contributor } from '@/core/types/contributor.type';
import type { LanguageVariant } from '@/core/types/language-variant.type';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { FieldErrorAdvice } from '@/ui/molecules/field-error-advice/field-error-advice';

import { ProfileVariantsEditor } from '../../molecules/profile-variants-editor/profile-variants-editor';

export interface ContributorAttributesPayload {
  alias: string;
  variantIds: string[];
}

interface ContributorDraft {
  alias: string;
  variants: LanguageVariant[];
}

@Component({
  selector: 'tm-profile-contributor-panel',
  imports: [
    ZardButtonComponent,
    ZardInputDirective,
    FormField,
    FieldErrorAdvice,
    ProfileVariantsEditor,
  ],
  templateUrl: './profile-contributor-panel.html',
  styleUrl: './profile-contributor-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContributorPanel {
  readonly contributor = input.required<Contributor | null>();
  readonly isSaving = input(false);

  readonly save = output<ContributorAttributesPayload>();

  protected readonly isEditing = signal(false);

  /**
   * Becomes true only when the user actually submits a save. The sync effect uses
   * it to decide whether to auto-exit edit mode once the server data matches the
   * draft, so entering edit mode (which seeds the draft) does not exit immediately.
   */
  private readonly submitted = signal(false);

  protected readonly model = signal<ContributorDraft>({
    alias: '',
    variants: [],
  });

  protected readonly form = form(this.model, (schema) => {
    required(schema.alias, { message: 'El alias es obligatorio.' });
    maxLength(schema.alias, 100, { message: 'El alias no puede exceder 100 caracteres.' });
    minLength(schema.variants, 1, { message: 'Debe tener al menos una variante.' });
  });

  constructor() {
    effect(() => {
      const contributor = this.contributor();
      if (!contributor) return;

      if (!this.isEditing()) {
        this.model.set({ alias: contributor.alias, variants: [...contributor.variants] });
        return;
      }

      if (!this.submitted()) return;

      const draft = this.model();
      const synced =
        draft.alias.trim() === contributor.alias &&
        draft.variants.length === contributor.variants.length &&
        contributor.variants.every((variant, index) => variant.id === draft.variants[index]?.id);

      if (synced) {
        this.isEditing.set(false);
        this.submitted.set(false);
      }
    });
  }

  protected startEditing(): void {
    const contributor = this.contributor();
    if (!contributor) return;
    this.submitted.set(false);
    this.model.set({ alias: contributor.alias, variants: [...contributor.variants] });
    this.isEditing.set(true);
  }

  protected cancelEditing(): void {
    const contributor = this.contributor();
    if (contributor) {
      this.model.set({ alias: contributor.alias, variants: [...contributor.variants] });
    }
    this.submitted.set(false);
    this.isEditing.set(false);
  }

  protected saveChanges(): void {
    this.form().markAsTouched();
    if (this.form().invalid() || this.isSaving()) return;

    const { alias, variants } = this.model();
    this.submitted.set(true);
    this.save.emit({ alias: alias.trim(), variantIds: variants.map((variant) => variant.id) });
  }
}
