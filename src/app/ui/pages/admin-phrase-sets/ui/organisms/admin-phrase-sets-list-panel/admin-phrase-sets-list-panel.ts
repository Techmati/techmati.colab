import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AdminPhraseSetCard } from '../../molecules/admin-phrase-set-card/admin-phrase-set-card';
import { AdminPhraseSetsPagination } from '../../molecules/admin-phrase-sets-pagination/admin-phrase-sets-pagination';
import type { AdminPhraseSetPreview } from '../../../admin-phrase-sets.types';

@Component({
  selector: 'tm-admin-phrase-sets-list-panel',
  imports: [AdminPhraseSetCard, AdminPhraseSetsPagination],
  templateUrl: './admin-phrase-sets-list-panel.html',
  styleUrl: './admin-phrase-sets-list-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetsListPanel {
  readonly phraseSets = input.required<readonly AdminPhraseSetPreview[]>();
  readonly totalResults = input.required<number>();
}
