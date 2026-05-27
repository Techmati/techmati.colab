import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly isLoading = signal(false);
  readonly success = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  private redirectTimerId: number | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.redirectTimerId !== null) {
        window.clearTimeout(this.redirectTimerId);
      }
    });
    effect(() => {
      if (this.contributorService.isLoggedIn()) {
        this.goToDashboard();
      }
    });
  }

  async onSubmit(data: RegisterFormData) {
    this.error.set(null);
    this.success.set(null);
    this.isLoading.set(true);
    const [_result, error] = await tryCatch(this.contributorService.access(data));
    this.error.set(
      error ? 'Ocurrió un error al registrarte. Por favor, inténtalo de nuevo.' : null,
    );
    this.isLoading.set(false);

    if (error) {
      console.log(error);
      return;
    }

    this.success.set('Registro exitoso. Te redirigiremos al dashboard en 3 segundos.');

    if (this.redirectTimerId !== null) {
      window.clearTimeout(this.redirectTimerId);
    }

    this.redirectTimerId = window.setTimeout(() => {
      this.goToDashboard();
    }, 3000);
  }

  private goToDashboard() {
    void this.router.navigate(['/dashboard']);
  }
}
