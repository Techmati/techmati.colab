import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'tm-admin-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-bottom-nav.html',
  styleUrl: './admin-bottom-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBottomNav {}
