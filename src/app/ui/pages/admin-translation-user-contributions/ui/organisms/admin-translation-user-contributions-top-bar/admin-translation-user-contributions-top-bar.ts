import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-admin-translation-user-contributions-top-bar',
  imports: [ZardButtonComponent],
  templateUrl: './admin-translation-user-contributions-top-bar.html',
  styleUrl: './admin-translation-user-contributions-top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationUserContributionsTopBar {
  readonly phraseSetTitle = input<string | null>(null);
  readonly userName = input<string | null>(null);

  private readonly location = inject(Location);

  protected goBack(): void {
    this.location.back();
  }
}
