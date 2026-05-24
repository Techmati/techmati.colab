import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ContributorService } from '@/core/service/contributor/contributor.service';
import { tryCatch } from '@/core/utils/try.util';
import { RegisterFormData, WelcomePanel } from './ui/organisms/welcome-panelb/welcome-panel';

@Component({
  selector: 'tm-welcome-page',
  imports: [ReactiveFormsModule, WelcomePanel],
  templateUrl: './welcome.page.html',
  styleUrl: './welcome.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePage {
  private readonly contributorService = inject(ContributorService);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  async onSubmit(data: RegisterFormData) {
    console.log('on submit called');
    this.isLoading.set(true);
    const [result, error] = await tryCatch(this.contributorService.register(data));
    // const [result, error] = await tryCatch(of(1).pipe(delay(2000)));
    this.error.set(
      error ? 'Ocurrió un error al registrarte. Por favor, inténtalo de nuevo.' : null,
    );
    this.isLoading.set(false);
  }
// readonly isLoading = signal(false);
// readonly isLoading = signal(false);
// protected readonly form = new FormGroup({
//   fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
// });
// protected readonly registerModel = signal({ fullName: '' });
// protected readonly registerForm = form(this.registerModel);
// readonly isInvalid = computed(
// () => this.registerForm().invalid() && this.registerForm().touched(),
// );
// protected onSubmit(): void {
// console.log('submitting');
// console.log({ invalid: this.form.invalid, value: this.form.value, touched: this.form.touched });
// if (this.form.invalid || !this.form.value.fullName) {
//   this.form.markAllAsTouched();
//   return;
// }
// this.isLoading.set(true);
// this.contributorService.register(this.registerForm.fullName().value());
// this.isLoading.set(false);
  }
