import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

@Component({
  selector: 'tm-app-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './app-banner.html',
  styleUrl: './app-banner.css',
})
export class AppBanner {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly visible = signal(true);
  protected readonly showIcon = signal(false);
  protected readonly logoUrl = '/res/brand.jpg';
  // 'https://www.figma.com/api/mcp/asset/9755c7a2-d4eb-487c-ab41-04aee4b6b7e0';

  constructor() {
    const iconTimerId = window.setTimeout(() => {
      this.showIcon.set(true);
    }, 120);

    const hideTimerId = window.setTimeout(() => {
      this.visible.set(false);
    }, 2100);

    this.destroyRef.onDestroy(() => {
      window.clearTimeout(iconTimerId);
      window.clearTimeout(hideTimerId);
    });
  }
}
