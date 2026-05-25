import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ZardInputDirective } from '@/shared/components/input';

type OnChangeFn = (value: string) => void;
type OnTouchedFn = () => void;

@Component({
  selector: 'tm-translation-textarea',
  imports: [ZardInputDirective],
  templateUrl: './translation-textarea.html',
  styleUrl: './translation-textarea.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TranslationTextarea),
      multi: true,
    },
  ],
})
export class TranslationTextarea implements ControlValueAccessor {
  readonly targetLanguage = input<string | null | undefined>();

  protected readonly value = signal('');
  protected readonly disabled = signal(false);

  private onChange: OnChangeFn = () => undefined;
  private onTouched: OnTouchedFn = () => undefined;

  writeValue(value: string | null | undefined): void {
    this.value.set(value ?? '');
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

  protected onInput(event: Event): void {
    const nextValue = (event.target as HTMLTextAreaElement | null)?.value ?? '';
    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  protected onBlur(): void {
    this.onTouched();
  }
}
