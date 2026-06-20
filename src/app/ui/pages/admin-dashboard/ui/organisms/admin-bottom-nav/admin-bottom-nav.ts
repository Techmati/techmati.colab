import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tm-admin-bottom-nav',
  imports: [RouterLink],
  templateUrl: './admin-bottom-nav.html',
  styleUrl: './admin-bottom-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBottomNav {}
