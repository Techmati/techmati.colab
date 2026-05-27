import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'tm-task-top-bar',
  imports: [],
  templateUrl: './task-top-bar.html',
  styleUrl: './task-top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTopBar {
  private readonly location = inject(Location);

  goBack() {
    this.location.back();
  }
}
