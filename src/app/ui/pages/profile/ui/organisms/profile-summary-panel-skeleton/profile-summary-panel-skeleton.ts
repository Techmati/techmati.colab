import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-profile-summary-panel-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './profile-summary-panel-skeleton.html',
  styleUrl: './profile-summary-panel-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSummaryPanelSkeleton {}
