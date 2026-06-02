import {
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ZardInputDirective } from '@/shared/components/input';

type OnChangeFn = (value: string) => void;
type OnTouchedFn = () => void;

@Component({
  selector: 'tm-translation-textarea',
  imports: [ZardInputDirective],
  templateUrl: './translation-textarea.html',
  styleUrl: './translation-textarea.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TranslationTextarea),
      multi: true,
    },
  ],
})
export class TranslationTextarea implements ControlValueAccessor {
  readonly language = input<string | null | undefined>();

  readonly disabled = model(false);
  protected readonly value = signal('');

  protected readonly targetLanguage = computed(() => {
    const language = this.language() || 'spanish_to_nahuatl';
    const map: { [key: string]: string } = {
      nahuatl_to_spanish: 'español',
      spanish_to_nahuatl: 'náhuatl',
    };
    return map[language];
  });

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
