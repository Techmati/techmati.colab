import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tm-bottom-nav-bar',
  imports: [RouterLink],
  templateUrl: './bottom-nav-bar.html',
  styleUrl: './bottom-nav-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavBar {
  readonly active = input<'dashboard' | 'profile' | 'contributors'>('dashboard');
}
