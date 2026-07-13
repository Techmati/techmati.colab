import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-contributor-card-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './contributor-card-skeleton.html',
  styleUrl: './contributor-card-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorCardSkeleton {}
