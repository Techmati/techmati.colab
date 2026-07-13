import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tm-contributors-header',
  imports: [],
  templateUrl: './contributors-header.html',
  styleUrl: './contributors-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsHeader {
  readonly count = input.required<number>();
}