import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { PhraseSet } from '@/core/types/phrase-set.type';
import { ZardButtonComponent } from '@/shared/components/button';

// TODO: change budget sizes in angular.json

@Component({
  selector: 'tm-admin-phrase-set-card',
  imports: [ZardButtonComponent],
  templateUrl: './admin-phrase-set-card.html',
  styleUrl: './admin-phrase-set-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPhraseSetCard {
  readonly phraseSet = input.required<PhraseSet>();
  protected readonly isExpanded = signal(false);

  private readonly previewPhrasesBySet: Record<string, readonly string[]> = {
    'vocabulario-medico-basico': ['Me duele la cabeza', 'Tengo fiebre', 'Respiración difícil'],
    'sintomas-comunes': ['Tengo dolor de garganta', 'Me siento mareado', 'No puedo dormir'],
    'partes-del-cuerpo': ['Cabeza', 'Pecho', 'Brazo derecho'],
    'emergencias-cardiacas': [
      'Me duele el pecho',
      'Mi corazón late rápido',
      'Necesito ayuda urgente',
    ],
    'protocolo-covid-19': ['Tengo tos seca', 'Perdí el olfato', 'Me falta el aire'],
  };

  protected readonly badgeLabel = computed(() =>
    this.phraseSet().published ? 'PUBLICADO' : 'BORRADOR',
  );
  protected readonly badgeClass = computed(() =>
    this.phraseSet().published
      ? 'shrink-0 rounded-full bg-brand-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-green-600'
      : 'shrink-0 rounded-full bg-surface-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary',
  );

  protected readonly cardClass = computed(() =>
    [
      'rounded-xl bg-card p-4 shadow-sm transition-all duration-300 ease-out',
      this.isExpanded()
        ? 'border-2 border-primary -translate-y-px'
        : 'border border-border-subtle hover:border-brand-purple-200',
    ].join(' '),
  );

  protected readonly chevronClass = computed(() =>
    [
      'lucide--chevron-right text-xl transition-transform duration-300 ease-out',
      this.isExpanded() ? 'rotate-90 text-primary' : 'text-border',
    ].join(' '),
  );

  protected readonly detailsClass = computed(() =>
    [
      'grid origin-top transition-all duration-300 ease-out',
      this.isExpanded()
        ? 'grid-rows-[1fr] scale-y-100 opacity-100'
        : 'grid-rows-[0fr] scale-y-95 opacity-0',
    ].join(' '),
  );

  protected readonly previewPhrases = computed(
    () =>
      this.previewPhrasesBySet[this.phraseSet().id] ?? [
        'Me duele la cabeza',
        'Tengo fiebre',
        'Respiración difícil',
      ],
  );

  protected toggleExpanded(): void {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }
}
