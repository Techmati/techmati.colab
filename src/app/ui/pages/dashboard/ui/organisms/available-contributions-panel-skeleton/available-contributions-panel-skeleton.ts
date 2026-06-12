import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-available-contributions-panel-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './available-contributions-panel-skeleton.html',
  styleUrl: './available-contributions-panel-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvailableContributionsPanelSkeleton {}
