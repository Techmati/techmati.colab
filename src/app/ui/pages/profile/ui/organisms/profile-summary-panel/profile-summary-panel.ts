import { TranslationEntryService } from '@/core/service/translation-entry/translation-entry.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tm-profile-summary-panel',
  imports: [],
  templateUrl: './profile-summary-panel.html',
  styleUrl: './profile-summary-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSummaryPanel {
  private readonly translationEntryService = inject(TranslationEntryService);

  readonly stats = rxResource({
    stream: () => this.translationEntryService.getStats(),
  });
}
