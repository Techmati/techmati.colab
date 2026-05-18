import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-task-top-bar',
  imports: [],
  templateUrl: './task-top-bar.html',
  styleUrl: './task-top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTopBar {}
