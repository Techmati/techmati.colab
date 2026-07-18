import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import type { ZardAccordionComponent } from '@/shared/components/accordion/accordion.component';
import {
  accordionContentVariants,
  accordionItemVariants,
  accordionTriggerVariants,
} from '@/shared/components/accordion/accordion.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-accordion-item',
  imports: [],
  template: `
    <button
      type="button"
      [attr.aria-controls]="'content-' + zValue()"
      [attr.aria-expanded]="isOpen()"
      [id]="'accordion-' + zValue()"
      [class]="triggerClasses()"
      (click)="toggle()"
    >
      <span class="space-x-2">
        @if (zIcon(); as icon) {
          <span [class]="icon"></span>
        }
        {{ zTitle() }}
      </span>
      <span
        class="lucide--chevron-down text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
        [class]="isOpen() ? 'rotate-180' : ''"
      ></span>
    </button>

    <div
      role="region"
      [attr.aria-labelledby]="'accordion-' + zValue()"
      [attr.data-state]="isOpen() ? 'open' : 'closed'"
      [id]="'content-' + zValue()"
      [class]="contentClasses()"
    >
      <div class="overflow-hidden">
        <div class="pt-0 pb-4">
          <ng-content />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [],
  host: {
    '[class]': 'itemClasses()',
    '[attr.data-state]': "isOpen() ? 'open' : 'closed'",
  },
  exportAs: 'zAccordionItem',
})
export class ZardAccordionItemComponent {
  readonly zTitle = input<string>('');
  readonly zValue = input<string>('');
  readonly zIcon = input<string>('');
  readonly class = input<ClassValue>('');

  accordion!: ZardAccordionComponent;
  readonly isOpen = signal(false);

  protected readonly itemClasses = computed(() =>
    mergeClasses(accordionItemVariants(), this.class()),
  );
  protected readonly triggerClasses = computed(() => mergeClasses(accordionTriggerVariants()));
  protected readonly contentClasses = computed(() =>
    mergeClasses(accordionContentVariants({ isOpen: this.isOpen() })),
  );

  toggle(): void {
    if (this.accordion) {
      this.accordion.toggleItem(this);
    } else {
      this.isOpen.update((v) => !v);
    }
  }
}
