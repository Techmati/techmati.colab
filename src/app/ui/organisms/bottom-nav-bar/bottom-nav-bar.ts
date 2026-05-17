import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tm-bottom-nav-bar',
  imports: [],
  templateUrl: './bottom-nav-bar.html',
  styleUrl: './bottom-nav-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavBar {
  readonly active = input<'dashboard' | 'profile'>('dashboard');
}
