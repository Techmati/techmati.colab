import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { HistoryListPanel } from './ui/organisms/history-list-panel/history-list-panel';

@Component({
  selector: 'tm-profile-history-page',
  imports: [TopAppBar, BottomNavBar, HistoryListPanel],
  templateUrl: './profile-history.page.html',
  styleUrl: './profile-history.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHistoryPage {}
