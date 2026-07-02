import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-admin-translation-detail-top-bar',
  imports: [ZardButtonComponent],
  templateUrl: './admin-translation-detail-top-bar.html',
  styleUrl: './admin-translation-detail-top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationDetailTopBar {
  private readonly location = inject(Location);

  protected goBack(): void {
    this.location.back();
  }
}
