import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-in-progress-panel-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './in-progress-panel-skeleton.html',
  styleUrl: './in-progress-panel-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InProgressPanelSkeleton {}
