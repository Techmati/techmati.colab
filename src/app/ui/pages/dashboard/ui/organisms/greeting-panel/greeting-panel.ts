import { AuthenticationService } from '@/core/service/authentication/authentication.service';
import { ContributorContextService } from '@/core/service/contributor-context/contributor-context.service';
import { TranslationService } from '@/core/service/translation/translation.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { GreetingPanelSkeleton } from '../greeting-panel-skeleton/greeting-panel-skeleton';

@Component({
  selector: 'tm-greeting-panel',
  imports: [GreetingPanelSkeleton],
  templateUrl: './greeting-panel.html',
  styleUrl: './greeting-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingPanel {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly translationService = inject(TranslationService);
  private readonly contributorContext = inject(ContributorContextService);

  protected readonly initialized = this.authenticationService.initialized;

  readonly singleName = computed(
    () => this.authenticationService.displayName().split(' ')[0] ?? 'Contribuidor',
  );

  readonly statsRes = injectQuery(() => {
    const active = this.contributorContext.active();
    return {
      ...this.translationService.getStats(active?.id),
    };
  });

  protected readonly currentStreak = computed(() =>
    Math.max(this.statsRes.data()?.currentStreak ?? 0, 0),
  );
}

