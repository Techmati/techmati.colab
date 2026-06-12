import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-history-list-panel-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './history-list-panel-skeleton.html',
  styleUrl: './history-list-panel-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryListPanelSkeleton {}
