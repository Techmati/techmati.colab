import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ZardButtonComponent } from '@/shared/components/button';

@Component({
  selector: 'tm-admin-phrase-set-editor-top-bar',
  imports: [RouterLink, ZardButtonComponent],
  templateUrl: './admin-phrase-set-editor-top-bar.html',
  styleUrl: './admin-phrase-set-editor-top-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetEditorTopBar {}
