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
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardSelectImports } from '@/shared/components/select';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { injectQuery } from '@tanstack/angular-query-experimental';

type OnChangeFn = (value: string[]) => void;
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
  protected readonly value = signal<string[]>([]);
  protected readonly pendingAdd = signal('');

  private readonly variantsService = inject(NahuatlVariantService);
  protected readonly allVariants = injectQuery(() => this.variantsService.list());
  protected readonly allVariantLabels = computed(
    () => this.allVariants.data()?.map((v) => v.label) || [],
  );

  protected readonly availableOptions = computed(() =>
    this.allVariantLabels().filter((variant) => !this.value().includes(variant)),
  );

  private onChange: OnChangeFn = () => undefined;
  private onTouched: OnTouchedFn = () => undefined;

  writeValue(value: string[] | null | undefined): void {
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

  protected removeVariant(variant: string): void {
    const next = this.value().filter((v) => v !== variant);
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }

  protected onPendingAddChange(): void {
    const nextValue = this.pendingAdd();
    if (!nextValue || this.value().includes(nextValue)) return;
    const next = [...this.value(), nextValue];
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
    this.pendingAdd.set('');
  }
}
