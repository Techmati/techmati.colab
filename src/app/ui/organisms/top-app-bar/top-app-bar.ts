import { ContributorService } from '@/core/service/contributor/contributor.service';
import { ZardButtonComponent } from '@/shared/components/button';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tm-top-app-bar',
  imports: [ZardButtonComponent],
  templateUrl: './top-app-bar.html',
  styleUrl: './top-app-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopAppBar {
  readonly title = input('Techmati');
  readonly subtitle = input('');

  private readonly contributorService = inject(ContributorService);
  private readonly router = inject(Router);

  logout() {
    console.log('Logging out...'); // Debug log
    this.contributorService.logout();
    this.router.navigate(['/']);
    console.log('Logged out'); // Debug log
  }
}
