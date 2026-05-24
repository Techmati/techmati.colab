import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputDirective } from '@/shared/components/input';
import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { form, FormField, minLength, required } from '@angular/forms/signals';

export type RegisterFormData = { fullName: string };

@Component({
  selector: 'tm-welcome-panel',
  imports: [
    NgOptimizedImage,
    FormField,
    CommonModule,
    ZardButtonComponent,
    ZardInputDirective,
    ZardInputGroupComponent,
  ],
  templateUrl: './welcome-panel.html',
  styleUrl: './welcome-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePanel {
  readonly isLoading = input.required<boolean>();
  readonly error = input<string | null>();

  readonly formSubmitted = output<RegisterFormData>();
  readonly model = signal<RegisterFormData>({ fullName: '' });
  readonly form = form(this.model, (schema) => {
    required(schema.fullName, { message: 'El nombre es obligatorio.' });
    minLength(schema.fullName, 3, { message: 'El nombre debe de ser de al menos 3 caracteres.' });
  });

  readonly isInvalid = computed(() => this.form().invalid() && this.form().touched());

  readonly name = model();

  constructor() {
    effect(() => console.log('invalid', this.isInvalid()));
  }

  protected readonly logoUrl = '/res/brand.jpg';

  onSubmit(event: Event) {
    event.preventDefault();
    console.log('submit', this.model());
    if (this.form().invalid()) {
      this.form.fullName().markAsTouched();
      return;
    }
    this.formSubmitted.emit(this.model());
    console.log('emitted');
  }
}
