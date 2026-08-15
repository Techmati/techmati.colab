import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { LanguageVariant } from '@/core/types/language-variant.type';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardButtonGroupComponent } from '@/shared/components/button-group';
import { VariantSearchInput } from '@/ui/molecules/variant-search-input/variant-search-input';

type OnChangeFn = (value: LanguageVariant[]) => void;
type OnTouchedFn = () => void;

@Component({
  selector: 'tm-profile-variants-editor',
  imports: [ZardButtonComponent, ZardButtonGroupComponent, VariantSearchInput],
  templateUrl: './profile-variants-editor.html',
  styleUrl: './profile-variants-editor.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProfileVariantsEditor),
      multi: true,
    },
  ],
})
export class ProfileVariantsEditor implements ControlValueAccessor {
  readonly searchInput = viewChild(VariantSearchInput);

  readonly disabled = signal(false);
  protected readonly value = signal<LanguageVariant[]>([]);
  protected readonly search = signal('');

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

  protected quickSearch(term: string): void {
    this.search.set(term);
    this.searchInput()?.focus();
  }

  protected removeVariant(variant: LanguageVariant): void {
    const next = this.value().filter((v) => v.id !== variant.id);
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }

  protected addVariant(variant: LanguageVariant | null): void {
    if (!variant || this.value().some((v) => v.id === variant.id)) return;
    const next = [...this.value(), variant];
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
    this.searchInput()?.clear();
  }
}
