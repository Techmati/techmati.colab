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
import { VariantSearchInput } from '@/ui/molecules/variant-search-input/variant-search-input';

type OnChangeFn = (value: LanguageVariant[]) => void;
type OnTouchedFn = () => void;

@Component({
  selector: 'tm-contributor-variants-input',
  imports: [ZardButtonComponent, ZardEmptyComponent, VariantSearchInput],
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
  protected readonly pendingVariant = signal<LanguageVariant | null>(null);

  protected readonly canAdd = computed(
    () => !!this.pendingVariant() && !this.value().some((v) => v.id === this.pendingVariant()!.id),
  );

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

  protected addVariant(): void {
    const variant = this.pendingVariant();
    if (!variant || this.value().some((v) => v.id === variant.id)) return;
    const next = [...this.value(), variant];
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
    this.pendingVariant.set(null);
  }
}
