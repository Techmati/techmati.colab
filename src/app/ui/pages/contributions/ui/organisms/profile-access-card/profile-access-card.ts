import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tm-profile-access-card',
  imports: [RouterLink],
  templateUrl: './profile-access-card.html',
  styleUrl: './profile-access-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileAccessCard {
  readonly name = input.required<string>();
  readonly handle = input.required<string>();
  readonly initials = input.required<string>();
}
