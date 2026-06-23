import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-admin-top-bar',
  imports: [ZardButtonComponent],
  templateUrl: './admin-top-bar.html',
  styleUrl: './admin-top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTopBar { }
