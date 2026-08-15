import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-task-top-bar',
  imports: [ZardButtonComponent],
  templateUrl: './task-top-bar.html',
  styleUrl: './task-top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTopBar {
  private readonly location = inject(Location);

  readonly cancelRequested = output<void>();
  readonly loading = input(false);

  goBack() {
    this.location.back();
  }
}
