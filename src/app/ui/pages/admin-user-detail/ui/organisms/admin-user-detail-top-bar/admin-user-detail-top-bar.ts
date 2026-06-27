import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-admin-user-detail-top-bar',
  imports: [ZardButtonComponent],
  templateUrl: './admin-user-detail-top-bar.html',
  styleUrl: './admin-user-detail-top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserDetailTopBar {
  private readonly location = inject(Location);

  protected goBack(): void {
    this.location.back();
  }
}
