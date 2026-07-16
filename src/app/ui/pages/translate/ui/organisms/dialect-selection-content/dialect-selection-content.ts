import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { TmLanguagePipe } from '@/core/pipes/tm-language-pipe';
import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { NahuatlVariantService } from '@/core/service/nahuatl-variant/nahuatl-variant.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { Z_ALERT_MODAL_DATA } from '@/shared/components/alert-dialog';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { DialectSelector } from '@/ui/molecules/dialect-selector/dialect-selector';

export interface DialectSelectionData {
  phraseSetId: string;
}

@Component({
  selector: 'tm-dialect-selection-content',
  imports: [DatePipe, TmLanguagePipe, ZardSkeletonComponent, DialectSelector],
  templateUrl: './dialect-selection-content.html',
  styleUrl: './dialect-selection-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialectSelectionContent {
  private readonly phraseSetsService = inject(PhraseSetsService);
  private readonly nahuatlVariantService = inject(NahuatlVariantService);
  private readonly contributorContext = inject(ContributorContextService);

  protected readonly data: DialectSelectionData = inject(
    Z_ALERT_MODAL_DATA,
  ) as DialectSelectionData;

  readonly phraseSetRes = injectQuery(() =>
    this.phraseSetsService.getPhraseSetById(this.data.phraseSetId),
  );

  readonly phraseSet = computed(() => this.phraseSetRes.data() ?? null);

  private readonly contributorVariants = computed(
    () => this.contributorContext.active()?.variants ?? [],
  );

  private readonly shouldFetchAllVariants = computed(() => this.contributorVariants().length === 0);

  readonly allVariantsRes = injectQuery(() => ({
    ...this.nahuatlVariantService.list(),
    enabled: this.shouldFetchAllVariants(),
  }));

  readonly availableVariants = computed(() => {
    if (this.shouldFetchAllVariants()) {
      return this.allVariantsRes.data() ?? [];
    }
    return this.contributorVariants();
  });

  readonly noVariantsAvailable = computed(
    () => !this.phraseSetRes.isPending() && this.availableVariants().length === 0,
  );

  protected readonly selectedVariantId = signal('');

  constructor() {
    effect(() => {
      const firstId = this.availableVariants()[0]?.id;
      if (firstId && !this.selectedVariantId()) {
        this.selectedVariantId.set(firstId);
      }
    });
  }

  getSelectedDialectId(): string | null {
    return this.selectedVariantId() || null;
  }
}

