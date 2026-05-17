import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'z-loader',
  imports: [],
  template: `
    <span
      class="lucide--loader-circle inline-block animate-spin text-muted-foreground"
      [class.size-3]="zSize() === 'sm'"
      [class.size-4]="zSize() === 'default'"
      [class.size-5]="zSize() === 'lg'"
      aria-hidden="true"
    ></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardLoaderComponent {
  readonly zSize = input<'sm' | 'default' | 'lg'>('default');
}
