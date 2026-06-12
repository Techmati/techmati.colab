import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-next-set-action-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './next-set-action-skeleton.html',
  styleUrl: './next-set-action-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextSetActionSkeleton {}
