import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tm-profile-info-header',
  imports: [],
  templateUrl: './profile-info-header.html',
  styleUrl: './profile-info-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileInfoHeader {
  readonly name = input.required<string>();
  readonly handle = input.required<string>();
  readonly initials = input.required<string>();
}
