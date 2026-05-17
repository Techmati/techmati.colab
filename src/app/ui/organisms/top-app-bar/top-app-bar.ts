import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tm-top-app-bar',
  imports: [],
  templateUrl: './top-app-bar.html',
  styleUrl: './top-app-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopAppBar {
  readonly title = input('Techmati');
  readonly subtitle = input('');
}
