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

import { LanguageVariant } from '@/core/types/language-variant.type';
import { PHRASE_SET_CATEGORY_LABELS } from '@/core/config/phrase-set-category-labels.config';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardSelectImports } from '@/shared/components/select';
import { TmLanguagePipe } from '@/core/pipes/tm-language-pipe';
import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { LanguageFamilyService } from '@/core/service/language-family/language-family.service';
import { LanguageGroupService } from '@/core/service/language-group/language-group.service';
import { PhraseSetsService } from '@/core/service/phrase-sets/phrase-sets.service';
import { Z_ALERT_MODAL_DATA } from '@/shared/components/alert-dialog';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { VariantSelector } from '@/ui/molecules/variant-selector/variant-selector';

export interface VariantSelectionData {
  phraseSetId: string;
}

@Component({
  selector: 'tm-variant-selection-content',
  imports: [DatePipe, TmLanguagePipe, ZardBadgeComponent, ...ZardSelectImports, ZardSkeletonComponent, VariantSelector],
  templateUrl: './variant-selection-content.html',
  styleUrl: './variant-selection-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariantSelectionContent {
  private readonly phraseSetsService = inject(PhraseSetsService);
  private readonly languageFamilyService = inject(LanguageFamilyService);
  private readonly languageGroupService = inject(LanguageGroupService);
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

  // Variant selection: cascading from contributor's registered variants
  protected readonly contributorVariants = computed(
    () => this.contributorContext.active()?.variants ?? [],
  );

  // If contributor has no registered variants, fetch all families for cascading selection
  readonly familiesRes = injectQuery(() => ({
    ...this.languageFamilyService.list(),
    enabled: this.contributorVariants().length === 0,
  }));

  readonly families = computed(() => this.familiesRes.data()?.data ?? []);

  protected readonly selectedFamilyId = signal('');
  protected readonly selectedGroupId = signal('');
  protected readonly selectedVariantId = signal('');

  // When a family is selected, fetch its groups
  readonly groupsRes = injectQuery(() => ({
    ...this.languageFamilyService.groups(this.selectedFamilyId(), true),
    enabled: !!this.selectedFamilyId(),
  }));

  readonly groups = computed(() => this.groupsRes.data()?.data ?? []);

  // When a group is selected, fetch its variants
  readonly variantsRes = injectQuery(() => ({
    ...this.languageGroupService.variants(this.selectedGroupId()),
    enabled: !!this.selectedGroupId(),
  }));

  readonly variants = computed(() => this.variantsRes.data()?.data ?? []);

  // Cascade for contributor's own variants: group by family
  readonly useContributorVariants = computed(() => this.contributorVariants().length > 0);

  readonly noVariantsAvailable = computed(
    () => !this.familiesRes.isPending() && this.families().length === 0 && !this.useContributorVariants(),
  );

  constructor() {
    effect(() => {
      if (this.useContributorVariants() && this.contributorVariants()[0]?.id && !this.selectedVariantId()) {
        this.selectedVariantId.set(this.contributorVariants()[0].id);
      }
    });
  }

  getSelectedVariantId(): string | null {
    if (this.useContributorVariants()) {
      return this.selectedVariantId() || null;
    }
    return this.selectedVariantId() || null;
  }

  protected onFamilySelect(value: string | string[]): void {
    const id = typeof value === 'string' ? value : '';
    this.selectedFamilyId.set(id);
    this.selectedGroupId.set('');
    this.selectedVariantId.set('');
  }

  protected onGroupSelect(value: string | string[]): void {
    const id = typeof value === 'string' ? value : '';
    this.selectedGroupId.set(id);
    this.selectedVariantId.set('');
  }

  protected onVariantSelect(value: string | string[]): void {
    const id = typeof value === 'string' ? value : '';
    this.selectedVariantId.set(id);
  }
}
