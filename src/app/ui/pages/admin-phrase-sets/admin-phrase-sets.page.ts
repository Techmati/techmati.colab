import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';
import { AdminPhraseSetsBottomNav } from './ui/organisms/admin-phrase-sets-bottom-nav/admin-phrase-sets-bottom-nav';
import { AdminPhraseSetsListPanel } from './ui/organisms/admin-phrase-sets-list-panel/admin-phrase-sets-list-panel';
import { AdminPhraseSetsToolbar } from './ui/organisms/admin-phrase-sets-toolbar/admin-phrase-sets-toolbar';

@Component({
  selector: 'tm-admin-phrase-sets-page',
  imports: [TopAppBar, AdminPhraseSetsToolbar, AdminPhraseSetsListPanel, AdminPhraseSetsBottomNav],
  templateUrl: './admin-phrase-sets.page.html',
  styleUrl: './admin-phrase-sets.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetsPage {
  readonly searchParam = input.required<string>();
}
