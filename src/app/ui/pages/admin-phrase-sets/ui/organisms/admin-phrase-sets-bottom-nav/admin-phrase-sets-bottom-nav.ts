import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tm-admin-phrase-sets-bottom-nav',
  imports: [RouterLink],
  templateUrl: './admin-phrase-sets-bottom-nav.html',
  styleUrl: './admin-phrase-sets-bottom-nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetsBottomNav {}
