import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { WelcomePanel } from './ui/welcome-panel/welcome-panel';

@Component({
  selector: 'tm-welcome-page',
  imports: [ReactiveFormsModule, WelcomePanel],
  templateUrl: './welcome.page.html',
  styleUrl: './welcome.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePage {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(2)]],
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Placeholder flow for next navigation step.
    console.log('continue', this.form.getRawValue());
  }
}
