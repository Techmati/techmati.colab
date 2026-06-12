import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-translation-task-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './translation-task-skeleton.html',
  styleUrl: './translation-task-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationTaskSkeleton {}
