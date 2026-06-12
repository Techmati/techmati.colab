import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tm-translation-summary-skeleton',
  imports: [ZardSkeletonComponent],
  templateUrl: './translation-summary-skeleton.html',
  styleUrl: './translation-summary-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationSummarySkeleton {}
