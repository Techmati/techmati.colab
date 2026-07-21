import { type TranslationEntry } from '@/core/types/translation-entry.type';
import type { LanguageVariant } from '@/core/types/language-variant.type';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AdminTranslationUserEntryCard } from '../../molecules/admin-translation-user-entry-card/admin-translation-user-entry-card';

@Component({
  selector: 'tm-admin-translation-user-entries-panel',
  imports: [AdminTranslationUserEntryCard, ZardEmptyComponent, ZardSkeletonComponent],
  templateUrl: './admin-translation-user-entries-panel.html',
  styleUrl: './admin-translation-user-entries-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTranslationUserEntriesPanel {
  readonly entries = input.required<readonly TranslationEntry[]>();
  readonly variant = input<LanguageVariant | null>(null);
  readonly isLoading = input.required<boolean>();
}
