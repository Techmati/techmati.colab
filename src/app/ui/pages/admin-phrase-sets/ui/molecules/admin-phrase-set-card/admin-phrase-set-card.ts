import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PhraseSet } from '@/core/types/phrase-set.type';

@Component({
  selector: 'tm-admin-phrase-set-card',
  imports: [],
  templateUrl: './admin-phrase-set-card.html',
  styleUrl: './admin-phrase-set-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetCard {
  readonly phraseSet = input.required<PhraseSet>();

  protected readonly badgeLabel = computed(() =>
    this.phraseSet().published ? 'PUBLICADO' : 'BORRADOR',
  );
  protected readonly badgeClass = computed(() =>
    this.phraseSet().published
      ? 'shrink-0 rounded-full bg-brand-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-green-600'
      : 'shrink-0 rounded-full bg-surface-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary',
  );
}
