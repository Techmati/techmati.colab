import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-greeting-panel-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './greeting-panel-skeleton.html',
  styleUrl: './greeting-panel-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingPanelSkeleton {}
