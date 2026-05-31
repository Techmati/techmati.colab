import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { BottomNavBar } from '@/ui/organisms/bottom-nav-bar/bottom-nav-bar';
import { TopAppBar } from '@/ui/organisms/top-app-bar/top-app-bar';

import { SkeletonComponent } from 'boneyard-js/angular';
import { HistoryListPanel } from './ui/organisms/history-list-panel/history-list-panel';

@Component({
  selector: 'tm-profile-history-page',
  imports: [TopAppBar, BottomNavBar, HistoryListPanel, SkeletonComponent],
  templateUrl: './profile-history.page.html',
  styleUrl: './profile-history.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHistoryPage {
  protected readonly isLoading = signal(false);
}
