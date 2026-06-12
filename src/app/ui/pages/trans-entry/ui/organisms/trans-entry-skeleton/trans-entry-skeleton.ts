import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-trans-entry-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './trans-entry-skeleton.html',
  styleUrl: './trans-entry-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransEntrySkeleton {}
