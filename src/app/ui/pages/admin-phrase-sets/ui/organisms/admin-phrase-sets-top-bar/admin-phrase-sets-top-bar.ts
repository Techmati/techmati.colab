import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-admin-phrase-sets-top-bar',
  imports: [RouterLink, ZardButtonComponent],
  templateUrl: './admin-phrase-sets-top-bar.html',
  styleUrl: './admin-phrase-sets-top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetsTopBar {}
