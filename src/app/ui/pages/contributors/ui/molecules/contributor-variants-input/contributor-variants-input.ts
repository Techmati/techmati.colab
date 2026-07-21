import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { LanguageVariant } from '@/core/types/language-variant.type';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { LanguageFamilyService } from '@/core/service/language-family/language-family.service';
import { LanguageGroupService } from '@/core/service/language-group/language-group.service';

type OnChangeFn = (value: LanguageVariant[]) => void;
type OnTouchedFn = () => void;

@Component({
  selector: 'tm-contributor-variants-input',
  imports: [ZardButtonComponent, ...ZardSelectImports, ZardEmptyComponent, ZardSkeletonComponent],
  templateUrl: './contributor-variants-input.html',
  styleUrl: './contributor-variants-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContributorVariantsInput),
      multi: true,
    },
  ],
})
export class ContributorVariantsInput implements ControlValueAccessor {
  readonly disabled = signal(false);
  protected readonly value = signal<LanguageVariant[]>([]);
  protected readonly pendingVariantId = signal('');

  private readonly languageFamilyService = inject(LanguageFamilyService);
  private readonly languageGroupService = inject(LanguageGroupService);

  readonly familiesQuery = injectQuery(() => this.languageFamilyService.list());

  protected readonly selectedFamilyId = signal('');
  protected readonly selectedGroupId = signal('');

  readonly groupsQuery = injectQuery(() => ({
    ...this.languageFamilyService.groups(this.selectedFamilyId()),
    enabled: !!this.selectedFamilyId(),
  }));

  readonly variantsQuery = injectQuery(() => ({
    ...this.languageGroupService.variants(this.selectedGroupId()),
    enabled: !!this.selectedGroupId(),
  }));

  protected readonly allVariants = computed(() => this.variantsQuery.data()?.data ?? []);

  protected readonly availableOptions = computed(
    () =>
      this.allVariants().filter(
        (variant) =>
          !this.value()
            .map((v) => v.id)
            .includes(variant.id),
      ) || [],
  );

  protected readonly canAdd = computed(() => {
    const id = this.pendingVariantId();
    return !!id && !this.value().some((v) => v.id === id);
  });

  private onChange: OnChangeFn = () => undefined;
  private onTouched: OnTouchedFn = () => undefined;

  writeValue(value: LanguageVariant[] | null | undefined): void {
    this.value.set(value ?? []);
  }

  registerOnChange(fn: OnChangeFn): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected removeVariant(variant: LanguageVariant): void {
    const next = this.value().filter((v) => v.id !== variant.id);
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }

  protected onFamilySelect(value: string | string[]): void {
    this.selectedFamilyId.set(typeof value === 'string' ? value : '');
    this.selectedGroupId.set('');
    this.pendingVariantId.set('');
  }

  protected onGroupSelect(value: string | string[]): void {
    this.selectedGroupId.set(typeof value === 'string' ? value : '');
    this.pendingVariantId.set('');
  }

  protected onVariantSelect(value: string | string[]): void {
    this.pendingVariantId.set(typeof value === 'string' ? value : '');
  }

  protected addVariant(): void {
    const id = this.pendingVariantId();
    if (!id || this.value().some((v) => v.id === id)) return;
    const variant = this.allVariants().find((v) => v.id === id);
    if (!variant) return;
    const next = [...this.value(), variant];
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
    this.pendingVariantId.set('');
  }
}
