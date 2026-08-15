import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'tm-profile-top-bar',
  imports: [],
  templateUrl: './profile-top-bar.html',
  styleUrl: './profile-top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileTopBar {
  private readonly location = inject(Location);

  protected goBack(): void {
    this.location.back();
  }
}
