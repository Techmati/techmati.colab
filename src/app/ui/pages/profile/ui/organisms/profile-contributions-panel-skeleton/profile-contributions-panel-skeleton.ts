import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-profile-contributions-panel-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './profile-contributions-panel-skeleton.html',
  styleUrl: './profile-contributions-panel-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileContributionsPanelSkeleton {}
