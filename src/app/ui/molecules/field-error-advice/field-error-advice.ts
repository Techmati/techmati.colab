import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Signal } from '@angular/core';
import type { ValidationError } from '@angular/forms/signals';

type ErrorAdviceField = () => {
  readonly touched: Signal<boolean>;
  readonly invalid: Signal<boolean>;
  readonly errors: Signal<readonly ValidationError.WithFieldTree[]>;
};

@Component({
  selector: 'tm-field-error-advice',
  templateUrl: './field-error-advice.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldErrorAdvice {
  readonly field = input.required<ErrorAdviceField>();
}
