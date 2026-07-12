import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ZardDividerComponent } from '@/shared/components/divider';
import { Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { defer, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { WavesAudioPlayer } from '../../molecules/waves-audio-player/waves-audio-player';
import { TransEntrySkeleton } from './ui/organisms/trans-entry-skeleton/trans-entry-skeleton';

@Component({
  selector: 'tm-trans-entry-page',
  imports: [WavesAudioPlayer, ZardDividerComponent, TransEntrySkeleton],
  templateUrl: './trans-entry.page.html',
  styleUrl: './trans-entry.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransEntryPage {
  readonly translationId = input.required<string>();
  readonly title = input<string>('');

  private readonly location = inject(Location);
  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);

  protected readonly entryRes = rxResource({
    params: computed(() => ({ translationId: this.translationId() })),
    stream: ({ params: { translationId } }) =>
      defer(() => from(this.contributorContext.getActiveContributorId())).pipe(
        switchMap((cId) => this.translationService.getDetail(cId, translationId)),
      ),
  });

  protected readonly entries = computed(() => this.entryRes.value()?.entries ?? []);

  protected goBack(): void {
    this.location.back();
  }
}
