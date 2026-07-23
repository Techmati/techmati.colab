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

import type { LanguageVariant } from '@/core/types/language-variant.type';
import { PHRASE_SET_CATEGORY_LABELS } from '@/core/config/phrase-set-category-labels.config';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { TmLanguagePipe } from '@/core/pipes/tm-language-pipe';
import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { Z_ALERT_MODAL_DATA } from '@/shared/components/alert-dialog';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { VariantSearchInput } from '@/ui/molecules/variant-search-input/variant-search-input';

export interface VariantSelectionData {
  phraseSetId: string;
}

@Component({
  selector: 'tm-variant-selection-content',
  imports: [DatePipe, TmLanguagePipe, ZardBadgeComponent, ZardSkeletonComponent, VariantSearchInput],
  templateUrl: './variant-selection-content.html',
  styleUrl: './variant-selection-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariantSelectionContent {
  private readonly phraseSetsService = inject(PhraseSetsService);
  private readonly contributorContext = inject(ContributorContextService);

  protected readonly data: VariantSelectionData = inject(
    Z_ALERT_MODAL_DATA,
  ) as VariantSelectionData;

  readonly phraseSetRes = injectQuery(() =>
    this.phraseSetsService.getPhraseSetById(this.data.phraseSetId),
  );

  readonly phraseSet = computed(() => this.phraseSetRes.data() ?? null);

  protected readonly categoryLabel = computed(() => {
    const cat = this.phraseSet()?.category;
    return cat ? PHRASE_SET_CATEGORY_LABELS[cat] : '';
  });

  // Contributor's own registered variants — shown as quick-select chips
  protected readonly contributorVariants = computed(
    () => this.contributorContext.active()?.variants ?? [],
  );

  readonly useContributorVariants = computed(() => this.contributorVariants().length > 0);

  protected readonly selectedVariant = signal<LanguageVariant | null>(null);

  constructor() {
    effect(() => {
      if (this.useContributorVariants() && this.contributorVariants()[0] && !this.selectedVariant()) {
        this.selectedVariant.set(this.contributorVariants()[0]);
      }
    });
  }

  getSelectedVariantId(): string | null {
    return this.selectedVariant()?.id ?? null;
  }

  protected selectContributorVariant(variant: LanguageVariant): void {
    this.selectedVariant.set(variant);
  }
}
