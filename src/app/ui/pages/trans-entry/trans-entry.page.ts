import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ZardDividerComponent } from '@/shared/components/divider';
import { VariantSelectionDialog } from '@/ui/organisms/variant-selection-dialog/variant-selection-dialog';
import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { WavesAudioPlayer } from '../../molecules/waves-audio-player/waves-audio-player';
import { TransEntrySkeleton } from './ui/organisms/trans-entry-skeleton/trans-entry-skeleton';

@Component({
  selector: 'tm-trans-entry-page',
  imports: [WavesAudioPlayer, ZardDividerComponent, TransEntrySkeleton, VariantSelectionDialog],
  templateUrl: './trans-entry.page.html',
  styleUrl: './trans-entry.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransEntryPage {
  readonly translationId = input.required<string>();
  readonly title = input<string>('');

  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  protected readonly entryRes = injectQuery(() => {
    const contributor = this.contributorContext.active()!;
    const translationId = this.translationId();
    return {
      ...this.translationService.findById(contributor.id, translationId),
      enabled: !!contributor && !!translationId,
    };
  });

  protected readonly entries = computed(() => this.entryRes.data()?.entries ?? []);

  constructor() {
    effect(() => console.log(this.entryRes.data()));
  }

  protected onTranslationCreated(translationId: string): void {
    this.router.navigate(['/translate', translationId]);
  }
  protected goBack(): void {
    this.location.back();
  }
}
