import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-greeting-panel',
  imports: [],
  templateUrl: './greeting-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingPanel {}
