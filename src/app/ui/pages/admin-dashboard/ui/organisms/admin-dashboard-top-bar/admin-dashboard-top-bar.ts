import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-admin-dashboard-top-bar',
  imports: [ZardButtonComponent],
  templateUrl: './admin-dashboard-top-bar.html',
  styleUrl: './admin-dashboard-top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardTopBar {}
