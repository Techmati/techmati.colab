import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-batch-progress-panel-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './batch-progress-panel-skeleton.html',
  styleUrl: './batch-progress-panel-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchProgressPanelSkeleton {}
