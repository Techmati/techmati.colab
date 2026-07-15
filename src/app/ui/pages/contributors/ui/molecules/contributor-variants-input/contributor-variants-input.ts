import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NahuatlVariantService } from '@/core/service/nahuatl-variant/nahuatl-variant.service';
import { NahuatlVariant } from '@/core/types/nahuatl-variant.type';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { injectQuery } from '@tanstack/angular-query-experimental';

type OnChangeFn = (value: NahuatlVariant[]) => void;
type OnTouchedFn = () => void;

@Component({
  selector: 'tm-contributor-variants-input',
  imports: [...ZardSelectImports, ZardEmptyComponent, ZardSkeletonComponent],
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
  protected readonly value = signal<NahuatlVariant[]>([]);
  protected readonly pendingAdd = signal<NahuatlVariant>(EMPTY_VARIANT);

  private readonly variantsService = inject(NahuatlVariantService);

  protected readonly allVariants = injectQuery(() => this.variantsService.list());
  protected readonly allVariantLabels = computed(
    () => this.allVariants.data()?.map((v) => v.label) || [],
  );

  protected variantMap = computed(() => {
    const map = new Map<string, NahuatlVariant>();
    this.allVariants.data()?.forEach((variant) => {
      map.set(variant.id, variant);
    });
    return map;
  });

  protected readonly availableOptions = computed(
    () =>
      this.allVariants.data()?.filter(
        (variant) =>
          !this.value()
            .map((v) => v.id)
            .includes(variant.id),
      ) || [],
  );

  private onChange: OnChangeFn = () => undefined;
  private onTouched: OnTouchedFn = () => undefined;

  writeValue(value: NahuatlVariant[] | null | undefined): void {
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

  protected removeVariant(variant: NahuatlVariant): void {
    const next = this.value().filter((v) => v.id !== variant.id);
    this.value.set(next);
    console.log('Removed variant:', variant, 'Next value:', next);
    this.onChange(next);
    this.onTouched();
  }

  protected onPendingAddChange(id: string | string[]): void {
    if (Array.isArray(id)) {
      this.pendingAdd.set(EMPTY_VARIANT);
      return;
    }

    const nextValue = this.getVariant(id);
    if (!nextValue || this.value().includes(nextValue)) return;
    const next = [...this.value(), nextValue];
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
    this.pendingAdd.set(EMPTY_VARIANT);
  }

  protected getVariant(id: string) {
    return this.variantMap().get(id) || EMPTY_VARIANT;
  }
}

const EMPTY_VARIANT = {
  id: 'Selectiona una variante...',
  label: 'Selecciona una variante...',
  code: '',
};
