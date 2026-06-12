import { Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';

import { TranslationEntryService } from '@/core/service/translation-entry/translation-entry.service';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
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
  readonly id = input.required<string>();
  readonly title = input.required<string>();

  private readonly location = inject(Location);
  private readonly translationEntryService = inject(TranslationEntryService);

  protected readonly entryRes = rxResource({
    params: computed(() => ({ id: this.id() })),
    stream: ({ params }) => this.translationEntryService.findEntriesByPhraseSetId(params.id),
  });

  protected readonly cards = computed(() => this.entryRes.value()?.entries || []);

  protected goBack(): void {
    this.location.back();
  }

  constructor() {
    effect(() => console.log(this.cards()));
  }
}
